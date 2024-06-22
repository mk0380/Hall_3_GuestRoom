import {
  email_otp_expiry_time_minutes,
  email_otp_length,
  error_occurred,
  internal_server_error,
  invalid_email,
  invalid_request_method,
} from "@/important_data/important_data";
import { sendForgetPasswordMail } from "@/mailing/sendForgetPasswordMail";
import User from "@/models/User";
import authoriseUser from "@/utils/authoriseUser";
import connectDB from "@/utils/connectDB";
import responseHandler from "@/utils/responseHandler";
import schemaValidator from "@/utils/schemaValidator";
import moment from "moment";
const { emailSchema } = require("@/utils/inputValidation");
const crypto = require("crypto");

const setPassword = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const isAuthorized = await authoriseUser(req, res);
    if (!isAuthorized.success) {
      return responseHandler(res, false, 401, invalid_or_expired_token);
    }

    const { email } = isAuthorized;

    const { success, message } = await schemaValidator(emailSchema, null, {
      email,
    });
    if (!success) {
      return responseHandler(res, false, 400, message);
    }

    const { success_db, message_db } = await connectDB();
    if (!success_db) {
      return responseHandler(res, false, 503, message_db);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return responseHandler(res, false, 409, invalid_email);
    }

    user.OTP.value = crypto.randomInt(
      Math.pow(10, email_otp_length - 1),
      Math.pow(10, email_otp_length)
    );
    user.OTP.expiryTime = moment(Date.now())
      .add(email_otp_expiry_time_minutes, "m")
      .toDate();

    const newData = await user.save();

    if (!newData) {
      return responseHandler(res, false, 500, error_occurred);
    }

    return await sendForgetPasswordMail(newData.OTP.value, newData.email, res);
  } catch (error) {
    console.log(`Some error occurend while setting OTP for password change: ${error.message}`);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default setPassword;
