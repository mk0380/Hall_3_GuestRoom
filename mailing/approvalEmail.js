const path = require("path");
var nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
const responseHandler = require("@/utils/responseHandler");
const {
  email_send_error,
  warden_approval_email,
  req_accepted_first_time,
} = require("@/important_data/important_data");
const findHec = require("@/utils/findHec");

const approvalEmail = async (email, amount, name, id, res) => {
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
      subject: warden_approval_email(id),
      template: "approvalEmail",
      context: {
        title: warden_approval_email(id),
        amount: amount,
        name: name,
        id: id,
        hec_name: await findHec("common_room", "name"),
        hec_position: await findHec("common_room", "position"),
      },
    };

    await transporter.sendMail(mailOptions);

    return responseHandler(res, true, 200, req_accepted_first_time);
  } catch (error) {
    console.error("Error sending email:", error);
    return responseHandler(res, false, 500, email_send_error);
  }
};

module.exports = { approvalEmail };
