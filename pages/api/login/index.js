const {
  internal_server_error,
  invalid_request_method,
  login_successful,
  wrong_credentials,
} = require("@/important_data/important_data");

const User = require("@/models/User");
const connectDB = require("@/utils/connectDB");
const responseHandler = require("@/utils/responseHandler");
const { userSchema } = require("@/utils/inputValidation");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { passwordMatch } = require("@/utils/bcryptHandler");

const login = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const { email, password } = req.body;

    try {
      await userSchema.validate({ email, password }, {
        strict: true,
      });
    } catch (error) {
      return responseHandler(res, false, 400, wrong_credentials);
    }

    await connectDB(res);

    const user = await User.findOne({ email });

    if (!user) {
      return responseHandler(res, false, 401, wrong_credentials);
    }

    const passwordCheck = await passwordMatch(password, user.password);

    if (!passwordCheck) {
      return responseHandler(res, false, 401, wrong_credentials);
    }

    const token = jwt.sign(
      { role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE_DAY * 24 * 60 * 60,
      }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "Bearer " + token, {
        maxAge: process.env.JWT_EXPIRE_DAY * 24 * 60 * 60,
        sameSite: "strict",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
    );

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
      },
      message: login_successful,
    });
  } catch (error) {
    console.log(error);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default login;
