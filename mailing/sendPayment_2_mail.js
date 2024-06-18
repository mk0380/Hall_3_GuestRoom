const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const responseHandler = require("@/utils/responseHandler");
const {
  email_send_error,
  payment_2_email,
  payment_2_confirmation_email,
} = require("@/important_data/important_data");
const findHec = require("@/utils/findHec");

const sendPayment2Mail = async (
  id,
  name,
  email,
  amount,
  arrivalDate,
  departureDate,
  roomNo,
  roomType,
  res
) => {
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: payment_2_email(id),
      template: "payment2",
      context: {
        title: payment_2_email(id),
        amount: amount,
        arrivalDate: arrivalDate,
        departureDate: departureDate,
        roomNo: roomNo,
        roomType: roomType,
        name: name,
        id: id,
        hec_name: await findHec("common_room", "name"),
        hec_position: await findHec("common_room", "position"),
      },
    };

    await transporter.sendMail(mailOptions);

    return responseHandler(res, true, 200, payment_2_confirmation_email);
  } catch (error) {
    console.error("Error sending email:", error);
    return responseHandler(res, false, 500, email_send_error);
  }
};

module.exports = { sendPayment2Mail };
