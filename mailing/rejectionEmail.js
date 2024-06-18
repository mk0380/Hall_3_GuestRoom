const path = require("path");
var nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
const responseHandler = require("@/utils/responseHandler");
const { email_send_error, warden_rejection_email, req_rejected_first_time } = require("@/important_data/important_data");
const findHec = require("@/utils/findHec");

const rejectionEmail = async(email, reason, name, id, res) => {
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
      subject: warden_rejection_email(id),
      template: "rejectionEmail",
      context: {
        title: warden_rejection_email(id),
        reason: reason,
        name: name,
        id: id,
        hec_name: await findHec("common_room", "name"),
        hec_position: await findHec("common_room", "position"),
      },
    };

    await transporter.sendMail(mailOptions);

    return responseHandler(res, true, 200, req_rejected_first_time);
  } catch (error) {
    console.error("Error sending email:", error);
    return responseHandler(res, false, 500, email_send_error);
  }
};

module.exports = { rejectionEmail };
