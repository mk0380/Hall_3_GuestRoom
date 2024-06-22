import schemaValidator from "@/utils/schemaValidator";
const {
  roomDetailsSchema,
  visitorDetailsSchema,
  indentorDetailsSchema,
} = require("@/utils/inputValidation");
const {
  booking_id_length,
  email_otp_expiry_time_minutes,
  email_otp_length,
  room_details: roomInDB,
  form_incomplete,
  invalid_room_details,
  invalid_visitor_details,
  error_occurred,
  timezone_date,
} = require("@/important_data/important_data");
const moment = require("moment-timezone");
const connectDB = require("@/utils/connectDB");
const guestRoom = require("@/models/BookingDetails");
const { emailToIndentorForOTP } = require("@/mailing/emailToIndentForOTP");
const {
  internal_server_error,
  invalid_request_method,
} = require("@/important_data/important_data");
const responseHandler = require("@/utils/responseHandler");
const crypto = require("crypto");

const details = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return responseHandler(res, false, 405, invalid_request_method);
    }

    const { room_details, visitor_details, indentor_details } = req.body;

    if (!room_details || !visitor_details || !indentor_details) {
      return responseHandler(res, false, 400, form_incomplete);
    }

    console.log(room_details);

    const { success, message } = await schemaValidator(roomDetailsSchema, null, room_details);
    if (!success) {
      return responseHandler(res, false, 401, message);
    }

    const roomDetails = roomInDB.filter(
      (data) => data.no === room_details.room_no
    );

    if (
      roomDetails.length === 0 ||
      roomDetails[0].code !== room_details.room_type ||
      roomDetails[0].max_persons < parseInt(room_details.no_of_persons) ||
      parseInt(room_details.no_of_persons) < 1
    ) {
      return responseHandler(res, false, 400, invalid_room_details);
    }

    const { success: success2, message: message2 } = await schemaValidator(visitorDetailsSchema, null, visitor_details);
    if (!success2) {
      return responseHandler(res, false, 401, message2);
    }

    const namesLen = visitor_details.name.length;
    const phonesLen = visitor_details.phone.length;
    const relationshipsLen = visitor_details.relationship.length;
    const max_persons = roomDetails[0].max_persons;

    if (
      namesLen !== phonesLen ||
      namesLen !== relationshipsLen ||
      namesLen > max_persons ||
      namesLen < 1
    ) {
      return responseHandler(res, false, 400, invalid_visitor_details);
    }

    const { success: success3, message: message3 } = await schemaValidator(indentorDetailsSchema, null, indentor_details);
    if (!success3) {
      return responseHandler(res, false, 401, message3);
    }

    const pricePerDay = roomDetails[0].price;
    const date1 = moment(
      room_details.arrival_date,
      "DD/MM/YYYY",
      timezone_date
    ).toISOString();
    const date2 = moment(
      room_details.departure_date,
      "DD/MM/YYYY",
      timezone_date
    ).toISOString();
    const numOfDaysStay = moment(date2).diff(moment(date1), "days") + 1;

    const visitorDetails = [...Array(parseInt(room_details.no_of_persons))].map(
      (_, indx) => {
        return {
          name: visitor_details.name[indx],
          phone: visitor_details.phone[indx],
          relationship: visitor_details.relationship[indx],
        };
      }
    );

    const { success_db, message_db } = await connectDB();
    if (!success_db) {
      return responseHandler(res, false, 503, message_db);
    }

    const bookingData = new guestRoom({
      indentorDetails: indentor_details,
      numberOfPersons: room_details.no_of_persons,
      totalCost: pricePerDay * numOfDaysStay,
      bookingId: crypto.randomInt(
        Math.pow(10, booking_id_length - 1),
        Math.pow(10, booking_id_length)
      ),
      purposeOfVisit: visitor_details.purpose,
      arrivalDate: room_details.arrival_date,
      departureDate: room_details.departure_date,
      roomDetails: {
        roomNo: roomDetails[0].no,
        roomType: roomDetails[0].beds,
      },
      visitorDetails,
    });

    const booking_res = await bookingData.save();

    if (!booking_res) {
      return responseHandler(res, false, 500, error_occurred);
    }

    const otp = crypto.randomInt(
      Math.pow(10, email_otp_length - 1),
      Math.pow(10, email_otp_length)
    );
    const expiry_time = moment(Date.now())
      .add(email_otp_expiry_time_minutes, "m")
      .toDate();

    bookingData.OTP.value = otp;
    bookingData.OTP.expiryTime = expiry_time;

    const newData = await bookingData.save();

    if (!newData) {
      return responseHandler(res, false, 500, error_occurred);
    }

    return await emailToIndentorForOTP(
      newData.indentorDetails.name,
      otp,
      newData.indentorDetails.email,
      newData.bookingId,
      res
    );
  } catch (error) {
    console.log(
      `Some error ocured while details with the details: ${error.message}`
    );
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default details;
