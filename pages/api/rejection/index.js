import {
    code_hall_office,
  code_warden,
  error_occurred,
  internal_server_error,
  invalid_or_expired_token,
  invalid_request_method,
  req_accepted,
  req_rejected,
} from "@/important_data/important_data";
import { rejectionEmail } from "@/mailing/rejectionEmail";
import guestRoom from "@/models/BookingDetails";
import authoriseUser from "@/utils/authoriseUser";
import connectDB from "@/utils/connectDB";
import responseHandler from "@/utils/responseHandler";
import schemaValidator from "@/utils/schemaValidator";
const { bookingIdSchema } = require("@/utils/inputValidation");

const wardenRejection = async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const isAuthorized = await authoriseUser(req, res);
    if (!isAuthorized.success) {
      return responseHandler(res, false, 401, invalid_or_expired_token);
    }

    const { booking_id, reason } = req.body;
    const { role } = isAuthorized;

    if( role !== code_warden && role!==code_hall_office){
        return responseHandler(res, false, 500, error_occurred);
    }

    const { success, message } = await schemaValidator(
      bookingIdSchema,
      "bookingId",
      booking_id
    );
    if (!success) {
      return responseHandler(res, false, 401, message);
    }

    const { success_db, message_db } = await connectDB();
    if (!success_db) {
      return responseHandler(res, false, 503, message_db);
    }

    const checkBookingData = await guestRoom.findOne({ bookingId: booking_id });

    if (!checkBookingData) {
      return responseHandler(res, false, 500, error_occurred);
    }

    if (role === code_warden && checkBookingData.approvalLevel === "-1") {
      return responseHandler(res, false, 409, req_rejected);
    }

    if (role === code_warden && checkBookingData.approvalLevel === "2") {
      return responseHandler(res, false, 409, req_accepted);
    }

    const bookingData = await guestRoom.findOneAndUpdate(
      { bookingId: booking_id },
      { approvalLevel: "-1", rejectionReason: reason }
    );

    if (!bookingData) {
      return responseHandler(res, false, 500, error_occurred);
    }

    return await rejectionEmail(
      bookingData.indentorDetails.email,
      reason,
      bookingData.indentorDetails.name,
      bookingData.bookingId,
      res
    );
  } catch (error) {
    console.log(
      `Some error occurend while rejecting the booking request: ${error.message}`
    );
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default wardenRejection;
