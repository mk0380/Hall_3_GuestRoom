import {
  email_not_registered,
  internal_server_error,
  invalid_request_method,
  otp_expired,
  password_updated,
  wrong_otp,
} from "@/important_data/important_data";
import authoriseUser from "@/utils/authoriseUser";
import { hashPassword } from "@/utils/bcryptHandler";
import connectDB from "@/utils/connectDB";
import responseHandler from "@/utils/responseHandler";
import schemaValidator from "@/utils/schemaValidator";
import moment from "moment";
const { userSchema, otpSchema } = require("@/utils/inputValidation");
const User = require("@/models/User");

const setPasswordValidateOTP = async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const { otp, password } = req.body;

    const isAuthorized = await authoriseUser(req, res);
    if (!isAuthorized.success) {
      return responseHandler(res, false, 401, invalid_or_expired_token);
    }

    const { email } = isAuthorized;

    const { success } = await schemaValidator(userSchema, null, {
      email,
      password,
    });
    if (!success) {
      return responseHandler(res, false, 400, wrong_credentials);
    }

    const { success: success2, message: message2 } = await schemaValidator(
      otpSchema,
      "otp",
      otp
    );
    if (!success2) {
      return responseHandler(res, false, 401, message2);
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

    userExist.OTP.value = null;
    userExist.OTP.expiryTime = null;
    userExist.password = await hashPassword(password);

    const newUser = await userExist.save();

    if (!newUser) {
      return responseHandler(res, false, 500, error_occurred);
    }

    return responseHandler(res, true, 200, password_updated);
  } catch (error) {
    console.log(`Some error occurend while changing password: ${error.message}`);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default setPasswordValidateOTP;
