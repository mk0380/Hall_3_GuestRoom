const {
  internal_server_error,
  invalid_request_method,
  logout_successfull,
} = require("@/important_data/important_data");
const responseHandler = require("@/utils/responseHandler");
const cookie = require("cookie");

const logout = async (req, res) => {
  try {
    if (req.method !== "GET") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        maxAge: 0,
        sameSite: "strict",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
    );

    return responseHandler(res, true, 200, logout_successfull);
  } catch (error) {
    console.log(
      `Error during during logout: ${error.message}`
    );
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default logout;
