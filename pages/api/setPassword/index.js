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
import connectDB from "@/utils/connectDB";
import responseHandler from "@/utils/responseHandler";
import moment from "moment";
const { emailSchema } = require("@/utils/inputValidation");
const crypto = require("crypto");

const setPassword = async (req, res) => {
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

    await connectDB(res);

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
    console.log(error.message);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default setPassword;
