import {
  error_occurred,
  internal_server_error,
  invalid_or_expired_token,
  invalid_request_method,
  req_accepted,
  req_rejected,
  validation_error,
  warden_email_list,
} from "@/important_data/important_data";
import { rejectionEmail } from "@/mailing/rejectionEmail";
import guestRoom from "@/models/BookingDetails";
import authoriseUser from "@/utils/authoriseUser";
import connectDB from "@/utils/connectDB";
import responseHandler from "@/utils/responseHandler";
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

    try {
      await bookingIdSchema.validate(
        { bookingId: booking_id },
        {
          strict: true,
        }
      );
    } catch (error) {
      return responseHandler(res, false, 400, validation_error(error.message));
    }

    await connectDB();

    const checkBookingData = await guestRoom.findOne({ bookingId: booking_id });

    if (!checkBookingData) {
      return responseHandler(res, false, 500, error_occurred);
    }

    if (warden_email_list.includes(isAuthorized.email) && checkBookingData.approvalLevel === "-1") {
      return responseHandler(res, false, 409, req_rejected);
    }

    if (warden_email_list.includes(isAuthorized.email) && checkBookingData.approvalLevel === "2") {
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
    console.log(error.message);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default wardenRejection;
