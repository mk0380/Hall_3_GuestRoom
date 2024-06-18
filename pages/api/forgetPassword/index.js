const {
  invalid_request_method,
  validation_error,
  warden_email_list,
  hall_office_email_list,
  invalid_email,
  email_not_registered,
  error_occurred,
  internal_server_error,
  email_otp_length,
  email_otp_expiry_time_minutes,
} = require("@/important_data/important_data");
const { sendForgetPasswordMail } = require("@/mailing/sendForgetPasswordMail");
const User = require("@/models/User");
const connectDB = require("@/utils/connectDB");
const { emailSchema } = require("@/utils/inputValidation");
const responseHandler = require("@/utils/responseHandler");
const moment = require("moment");
const crypto = require("crypto");

const forgetPassword = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const { email } = req.body;

    try {
      await emailSchema.validate(
        { email },
        {
          strict: true,
        }
      );
    } catch (error) {
      return responseHandler(res, false, 400, validation_error(error.message));
    }

    const validEmails = [...warden_email_list, ...hall_office_email_list];

    if (!validEmails.includes(email)) {
      return responseHandler(res, false, 401, invalid_email);
    }

    await connectDB(res);

    const user = await User.findOne({ email });

    if (!user) {
      return responseHandler(res, false, 404, email_not_registered);
    }

    user.OTP.value = crypto.randomInt(
      Math.pow(10, email_otp_length - 1),
      Math.pow(10, email_otp_length)
    );
    user.OTP.expiryTime = moment(Date.now())
      .add(email_otp_expiry_time_minutes, "m")
      .toDate();

    const newUser = await user.save();

    if (!newUser) {
      return responseHandler(res, false, 500, error_occurred);
    }

    return await sendForgetPasswordMail(newUser.OTP.value, email, res);
  } catch (error) {
    console.error(`Error in forgetPassword: ${error.message}`);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default forgetPassword;
