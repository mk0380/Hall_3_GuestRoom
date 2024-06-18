const path = require("path");
var nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
const findHec = require("@/utils/findHec");
const { indentor_confirmation_otp_email, indentor_askfor_otp_email } = require("@/important_data/important_data");

const emailToIndentorForOTP = async (name, otp, email, id, res) => {
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
      subject: indentor_confirmation_otp_email,
      template: "emailToIndentForOTP",
      context: {
        title: indentor_confirmation_otp_email,
        name: name,
        otp: otp,
        id: id,
        hec_name: await findHec("common_room", "name"),
        hec_position: await findHec("common_room", "position"),
      },
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: indentor_askfor_otp_email,
      id,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return responseHandler(res, false, 500, email_send_error);
  }
};

module.exports = { emailToIndentorForOTP };
