import schemaValidator from "@/utils/schemaValidator";
const connectDB = require("@/utils/connectDB");
const {
  internal_server_error,
  invalid_request_method,
  warden_email_list,
  booking_id_not_found,
  invalid_otp,
  otp_expired,
  error_occurred,
  date_conflict,
  timezone_date,
} = require("@/important_data/important_data");
const responseHandler = require("@/utils/responseHandler");
const { otpSchema, bookingIdSchema } = require("@/utils/inputValidation");
const guestRoom = require("@/models/BookingDetails");
const moment = require("moment-timezone");
const { emailToNotifyWarden } = require("@/mailing/emailToNotifyWarden");

const checkOTP = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const { otp_password, requestId } = req.body;

    const { success, message } = await schemaValidator(bookingIdSchema, 'bookingId', requestId);
    if (!success) {
      return responseHandler(res, false, 401, message);
    }

    const { success: success2, message: message2 } = await schemaValidator(otpSchema, 'otp', otp_password);
    if (!success2) {
      return responseHandler(res, false, 401, message2);
    }

    const { success_db, message_db } = await connectDB();
    if (!success_db) {
      return responseHandler(res, false, 503, message_db);
    }

    const bookingData = await guestRoom.findOne({ bookingId: requestId });

    if (!bookingData) {
      return responseHandler(res, false, 404, booking_id_not_found);
    }

    if (bookingData.OTP.value !== otp_password) {
      return responseHandler(res, false, 401, invalid_otp);
    }

    const time1 = moment.tz(Date.now(), timezone_date);
    const time2 = moment.tz(bookingData.OTP.expiryTime, timezone_date)

    if (time1 > time2) {
      return responseHandler(res, false, 401, otp_expired);
    }

    const allBookings = await guestRoom
      .find({})
      .select(["arrivalDate", "departureDate", "roomDetails", "approvalLevel"]);

    if (!allBookings) {
      return responseHandler(res, false, 500, error_occurred);
    }

    const arrivalDates = allBookings.map((booking) => booking.arrivalDate);
    const departureDates = allBookings.map((booking) => booking.departureDate);
    const roomNos = allBookings.map((booking) => booking.roomDetails.roomNo);
    const approvalLevel = allBookings.map((booking) => booking.approvalLevel);

    const arrival_date = moment(bookingData.arrivalDate, "DD/MM/YYYY").tz(timezone_date);
    const departure_date = moment(bookingData.departureDate, "DD/MM/YYYY").tz(timezone_date);

    while (arrival_date.isSameOrBefore(departure_date)) {
      const date = arrival_date.tz(timezone_date).format("DD/MM/YYYY");
      for (let index = 0; index < arrivalDates.length; index++) {
        const formattedArrivalDate = moment(
          arrivalDates[index],
          "DD/MM/YYYY",
          true
        );
        const formattedDepartureDate = moment(
          departureDates[index],
          "DD/MM/YYYY",
          true
        );
        const formattedDate = moment(date, "DD/MM/YYYY", true);

        const isWithinRange =
          formattedArrivalDate.isValid() &&
          formattedDate.isValid() &&
          formattedDepartureDate.isValid() &&
          formattedArrivalDate.isSameOrBefore(formattedDate) &&
          formattedDepartureDate.isSameOrAfter(formattedDate) &&
          roomNos[index] === bookingData.roomDetails.roomNo &&
          (approvalLevel[index] === "1" ||
            approvalLevel[index] === "2" ||
            approvalLevel[index] === "3" ||
            approvalLevel[index] === "4");

        if (isWithinRange) {
          return responseHandler(res, false, 409, date_conflict);
        }
      }
      arrival_date.add(1, "day").tz(timezone_date);
    }

    bookingData.approvalLevel = "1";
    bookingData.OTP.value = null;
    bookingData.OTP.expiryTime = null;

    const bookingDataNew = await bookingData.save();

    if (!bookingDataNew) {
      return responseHandler(res, false, 500, error_occurred);
    }

    return await emailToNotifyWarden(warden_email_list, res);
  } catch (error) {
    console.log(`Some error occurend while checking the otp by the Indentor: ${error.message}`);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default checkOTP;
