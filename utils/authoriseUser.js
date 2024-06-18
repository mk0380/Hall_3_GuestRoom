const {
  code_hall_office,
  code_warden,
  hall_office_email_list,
  warden_email_list,
} = require("@/important_data/important_data");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const authoriseUser = async (req) => {
  try {
    const { token } = cookie.parse(req?.headers?.cookie || "");
    if (!token) return { success: false };

    const tokenValue = token.split(" ")[1];
    if (!tokenValue) return { success: false };

    let verify;
    try {
      verify = jwt.verify(tokenValue, process.env.JWT_SECRET);
    } catch (error) {
      console.error(`JWT verification error: ${error.message}`);
      return { success: false };
    }

    const { email, role } = verify;
    const isAuthorised =
      (role === code_warden && warden_email_list.includes(email)) ||
      (role === code_hall_office && hall_office_email_list.includes(email));

    return { success: isAuthorised, email, role };
  } catch (error) {
    console.error(`Authorization error: ${error.message}`);
    return { success: false };
  }
};

export default authoriseUser;
