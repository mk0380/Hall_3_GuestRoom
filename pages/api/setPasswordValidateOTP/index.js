import {
  email_not_registered,
  internal_server_error,
  invalid_request_method,
  otp_expired,
  password_updated,
  validation_error,
  wrong_otp,
} from "@/important_data/important_data";
import { hashPassword } from "@/utils/bcryptHandler";
import connectDB from "@/utils/connectDB";
import responseHandler from "@/utils/responseHandler";
import moment from "moment";
const { userSchema, otpSchema } = require("@/utils/inputValidation");
const User = require("@/models/User");


const setPasswordValidateOTP = async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const { otp, email, password } = req.body;

    try {
      await userSchema.validate(
        { email, password },
        {
          strict: true,
        }
      );
    } catch (error) {
      return responseHandler(res, false, 400, validation_error(error.message));
    }

    try {
      await otpSchema.validate(
        { otp },
        {
          strict: true,
        }
      );
    } catch (error) {
      return responseHandler(res, false, 400, validation_error(error.message));
    }

    await connectDB();

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

    userExist.OTP.value = null;
    userExist.OTP.expiryTime = null;
    userExist.password = await hashPassword(password)

    const newUser = await userExist.save();

    if (!newUser) {
      return responseHandler(res, false, 500, error_occurred);
    }

    return responseHandler(res, true, 200, password_updated);
  } catch (error) {
    console.log(error.message);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default setPasswordValidateOTP;
