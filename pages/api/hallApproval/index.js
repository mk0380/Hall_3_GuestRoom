import {
  error_occurred,
  hall_office_email_list,
  internal_server_error,
  invalid_or_expired_token,
  invalid_request_method,
  percentage_price_to_be_paid_for_booking_confirmation,
  validation_error,
} from "@/important_data/important_data";
import { sendPayment1Mail } from "@/mailing/sendPayment_1_mail";
import { sendPayment2Mail } from "@/mailing/sendPayment_2_mail";
import guestRoom from "@/models/BookingDetails";
import authoriseUser from "@/utils/authoriseUser";
import connectDB from "@/utils/connectDB";
import responseHandler from "@/utils/responseHandler";
const { bookingIdSchema } = require("@/utils/inputValidation");

const hallApproval = async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const isAuthorized = await authoriseUser(req, res);
    if (!isAuthorized.success) {
      return responseHandler(res, false, 401, invalid_or_expired_token);
    }

    if (!hall_office_email_list.includes(isAuthorized.email)) {
      return responseHandler(res, false, 401, invalid_or_expired_token);
    }

    const { booking_id } = req.body;

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

    let changedBookingData = undefined;

    if (checkBookingData.approvalLevel === "2") {
      changedBookingData = await guestRoom.findOneAndUpdate(
        { bookingId: booking_id },
        { approvalLevel: "3" }
      );

      if (!changedBookingData) {
        return responseHandler(res, false, 500, error_occurred);
      }

      return await sendPayment1Mail(
        booking_id,
        checkBookingData.indentorDetails.name,
        checkBookingData.indentorDetails.email,
        parseInt(
          Math.ceil(
            checkBookingData.totalCost *
              percentage_price_to_be_paid_for_booking_confirmation
          )
        ),
        checkBookingData.arrivalDate,
        checkBookingData.departureDate,
        checkBookingData.roomDetails.roomNo,
        checkBookingData.roomDetails.roomType,
        res
      );
    } else if (checkBookingData.approvalLevel === "3") {
      changedBookingData = await guestRoom.findOneAndUpdate(
        { bookingId: booking_id },
        { approvalLevel: "4", paid: true }
      );

      if (!changedBookingData) {
        return responseHandler(res, false, 500, error_occurred);
      }

      return await sendPayment2Mail(
        booking_id,
        checkBookingData.indentorDetails.name,
        checkBookingData.indentorDetails.email,
        parseInt(
          checkBookingData.totalCost -
            parseInt(
              Math.ceil(
                checkBookingData.totalCost *
                  percentage_price_to_be_paid_for_booking_confirmation
              )
            )
        ),
        checkBookingData.arrivalDate,
        checkBookingData.departureDate,
        checkBookingData.roomDetails.roomNo,
        checkBookingData.roomDetails.roomType,
        res
      );
    }

    return responseHandler(res, false, 500, error_occurred);
  } catch (error) {
    console.log(error.message);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default hallApproval;
