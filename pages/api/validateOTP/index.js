import { hashPassword } from "@/utils/bcryptHandler";

const {
  email_not_registered,
  internal_server_error,
  invalid_request_method,
  otp_expired,
  otp_validated,
  validation_error,
  wrong_otp,
  error_occurred,
} = require("@/important_data/important_data");

const User = require("@/models/User");
const connectDB = require("@/utils/connectDB");
const { emailSchema, otpSchema } = require("@/utils/inputValidation");
const responseHandler = require("@/utils/responseHandler");
const moment = require("moment");

const validateOTP = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const { otp, email } = req.body;

    try {
      await emailSchema.validate(
        { email },
        {
          strict: true,
        }
      );
      await otpSchema.validate(
        { otp },
        {
          strict: true,
        }
      );
    } catch (error) {
      return responseHandler(res, false, 401, validation_error(error.message));
    }

    await connectDB(res);

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return responseHandler(res, false, 404, email_not_registered);
    }

    if (userExist.OTP.value !== otp) {
      return responseHandler(res, false, 401, wrong_otp);
    }

    const time1 = new Date(moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZZ"));
    const time2 = new Date(
      moment(userExist.OTP.expiryTime).format("YYYY-MM-DDTHH:mm:ssZZ")
    );

    if (time2 < time1) {
      return responseHandler(res, false, 401, otp_expired);
    }

    userExist.OTP.value = await hashPassword(process.env.OTP_SECRET);
    userExist.OTP.expiryTime = null;

    const newUser = await userExist.save();

    if (!newUser) {
      return responseHandler(res, false, 500, error_occurred);
    }

    return responseHandler(res, true, 200, otp_validated);
  } catch (error) {
    console.error(`Error validating OTP: ${error.message}`);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default validateOTP;
