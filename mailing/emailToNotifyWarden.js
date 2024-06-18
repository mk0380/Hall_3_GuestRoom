const path = require("path");
var nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
const {
  frontend_url,
  email_send_error,
  email_booking_request_success,
  notify_warden_email,
} = require("@/important_data/important_data");
const findHec = require("@/utils/findHec");
const responseHandler = require("@/utils/responseHandler");

const emailToNotifyWarden = async (email, res) => {
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
      subject: notify_warden_email,
      template: "emailToNotifyWarden",
      context: {
        title: notify_warden_email,
        name: await findHec("web", "name"),
        position: await findHec("web", "position"),
        frontendUrl: frontend_url,
      },
    };

    await transporter.sendMail(mailOptions);

    return responseHandler(res, true, 200, email_booking_request_success);

  } catch (error) {
    console.error("Error sending email:", error);
    return responseHandler(res, false, 500, email_send_error);
  }
};

module.exports = { emailToNotifyWarden };
