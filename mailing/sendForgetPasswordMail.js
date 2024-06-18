const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const {
  subject_forget_password_email,
  otp_sent,
  email_send_error,
} = require("@/important_data/important_data");
const findHec = require("@/utils/findHec");
const responseHandler = require("@/utils/responseHandler");

const sendForgetPasswordMail = async (otp, email, res) => {
  try {
    var transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve("./mailing/views"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./mailing/views"),
      extName: ".handlebars",
    };

    transporter.use("compile", hbs(handlebarOptions));

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject_forget_password_email,
      template: "sendForgetPasswordMail",
      context: {
        title: subject_forget_password_email,
        otp: otp,
        name: await findHec("web", "name"),
        position: await findHec("web", "position"),
      },
    };

    await transporter.sendMail(mailOptions);

    return responseHandler(res, true, 200, otp_sent);
  } catch (error) {
    console.error("Error sending email:", error);
    return responseHandler(res, false, 500, email_send_error);
  }
};

module.exports = { sendForgetPasswordMail };
