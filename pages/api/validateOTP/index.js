import { hashPassword } from "@/utils/bcryptHandler";
import schemaValidator from "@/utils/schemaValidator";
const {
  email_not_registered,
  internal_server_error,
  invalid_request_method,
  otp_expired,
  otp_validated,
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

    const { success, message } = await schemaValidator(emailSchema, null, {
      email,
    });
    if (!success) {
      return responseHandler(res, false, 400, message);
    }

    const { success: success2, message: message2 } = await schemaValidator(
      otpSchema,
      null,
      {
        otp,
      }
    );
    if (!success2) {
      return responseHandler(res, false, 400, message2);
    }

    const { success_db, message_db } = await connectDB();
    if (!success_db) {
      return responseHandler(res, false, 503, message_db);
    }

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
