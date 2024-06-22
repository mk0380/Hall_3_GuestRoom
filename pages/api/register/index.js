import authoriseUser from "@/utils/authoriseUser";
import schemaValidator from "@/utils/schemaValidator";
const { hashPassword } = require("@/utils/bcryptHandler");
const User = require("@/models/User");
const connectDB = require("@/utils/connectDB");
const responseHandler = require("@/utils/responseHandler");
const { userSchema } = require("@/utils/inputValidation");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const {
  hall_office_email_list,
  warden_email_list,
  token_not_provided,
  invalid_request_method,
  email_not_authorized,
  email_already_registered,
  code_warden,
  code_hall_office,
  error_creating_user,
  registration_successful,
  internal_server_error,
} = require("@/important_data/important_data");

const register = async (req, res) => {
  try {
    if (req.method === "GET") {
      const data = await authoriseUser(req);

      if (data?.success ?? false) {
        const payload = {
          user: {
            email: data?.email ?? "",
            role: data?.role ?? "",
          },
        };

        return responseHandler(res, true, 200, "", payload);
      } else {
        return responseHandler(res, false, 401, token_not_provided);
      }
    }

    if (req.method !== "POST") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const { email, password } = req.body;

    const { success, message } = await schemaValidator(userSchema, null, {
      email,
      password,
    });
    if (!success) {
      return responseHandler(res, false, 400, message);
    }

    const validEmails = [...warden_email_list, ...hall_office_email_list];

    if (!validEmails.includes(email)) {
      return responseHandler(res, false, 401, email_not_authorized);
    }

    const { success_db, message_db } = await connectDB();
    if (!success_db) {
      return responseHandler(res, false, 503, message_db);
    }

    const user = await User.findOne({ email });

    if (user) {
      return responseHandler(res, false, 409, email_already_registered);
    }

    const role = warden_email_list.includes(email)
      ? code_warden
      : code_hall_office;

    const newUser = await User.create({
      email,
      role,
      password: await hashPassword(password),
    });

    if (!newUser) {
      return responseHandler(res, false, 500, error_creating_user);
    }

    const token = jwt.sign({ role, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_DAY * 24 * 60 * 60,
    });

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

    return responseHandler(res, true, 200, registration_successful, null);
  } catch (error) {
    console.log(`Some error occured while registratoin: ${error.message}`);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default register;
