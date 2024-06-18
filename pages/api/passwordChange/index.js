const { hashPassword, passwordMatch } = require("@/utils/bcryptHandler");
const {
  email_not_registered,
  internal_server_error,
  invalid_request_method,
  validation_error,
  password_changed_successfully,
  error_occurred,
  invalid_request,
} = require("@/important_data/important_data");
const User = require("@/models/User");
const connectDB = require("@/utils/connectDB");
const { passwordSchema, emailSchema } = require("@/utils/inputValidation");
const responseHandler = require("@/utils/responseHandler");

const passwordChange = async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const { email, newPassword } = req.body;

    try {
      await emailSchema.validate(
        { email },
        {
          strict: true,
        }
      );

      await passwordSchema.validate(
        { password: newPassword },
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

    if (!(await passwordMatch(process.env.OTP_SECRET, userExist.OTP.value))) {
      return responseHandler(res, false, 401, invalid_request);
    }

    userExist.password = await hashPassword(newPassword);
    userExist.OTP.value = null;

    const newUser = await userExist.save();

    if (!newUser) {
      return responseHandler(res, false, 500, error_occurred);
    }

    return responseHandler(res, true, 200, password_changed_successfully);
  } catch (error) {
    console.error(`Error during password change: ${error.message}`);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default passwordChange;
