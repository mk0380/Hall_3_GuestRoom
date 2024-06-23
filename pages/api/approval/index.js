import {
  code_hall_office,
  code_warden,
  error_occurred,
  internal_server_error,
  invalid_or_expired_token,
  invalid_request_method,
  percentage_price_to_be_paid_for_booking_confirmation,
  req_accepted,
  req_rejected,
} from "@/important_data/important_data";
import { approvalEmail } from "@/mailing/approvalEmail";
import { sendPayment1Mail } from "@/mailing/sendPayment_1_mail";
import { sendPayment2Mail } from "@/mailing/sendPayment_2_mail";
import guestRoom from "@/models/BookingDetails";
import authoriseUser from "@/utils/authoriseUser";
import connectDB from "@/utils/connectDB";
import responseHandler from "@/utils/responseHandler";
import schemaValidator from "@/utils/schemaValidator";
const { bookingIdSchema } = require("@/utils/inputValidation");

const approval = async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const isAuthorized = await authoriseUser(req, res);
    if (!isAuthorized?.success ?? true) {
      return responseHandler(res, false, 401, invalid_or_expired_token);
    }

    const { role } = isAuthorized;
    const { booking_id } = req.body;

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

    if (role === code_warden) {
      if (checkBookingData.approvalLevel === "-1") {
        return responseHandler(res, false, 409, req_rejected);
      }

      if (checkBookingData.approvalLevel === "2") {
        return responseHandler(res, false, 409, req_accepted);
      }

      const bookingData = await guestRoom.findOneAndUpdate(
        { bookingId: booking_id },
        { approvalLevel: "2" }
      );

      if (!bookingData) {
        return responseHandler(res, false, 500, error_occurred);
      }

      return await approvalEmail(
        bookingData.indentorDetails.email,
        parseInt(
          Math.ceil(
            bookingData.totalCost *
              percentage_price_to_be_paid_for_booking_confirmation
          )
        ),
        bookingData.indentorDetails.name,
        bookingData.bookingId,
        res
      );
    } else if (role === code_hall_office) {
      let changedBookingData = undefined;
      let mailFunction = undefined;

      if (checkBookingData.approvalLevel === "2") {
        changedBookingData = await guestRoom.findOneAndUpdate(
          { bookingId: booking_id },
          { approvalLevel: "3" }
        );
        mailFunction = sendPayment1Mail;
      } else if (checkBookingData.approvalLevel === "3") {
        changedBookingData = await guestRoom.findOneAndUpdate(
          { bookingId: booking_id },
          { approvalLevel: "4", paid: true }
        );
        mailFunction = sendPayment2Mail;
      }

      if (!changedBookingData) {
        return responseHandler(res, false, 500, error_occurred);
      }

      const paymentAmount =
        checkBookingData.approvalLevel === "2"
          ? parseInt(
              Math.ceil(
                checkBookingData.totalCost *
                  percentage_price_to_be_paid_for_booking_confirmation
              )
            )
          : parseInt(
              checkBookingData.totalCost -
                parseInt(
                  Math.ceil(
                    checkBookingData.totalCost *
                      percentage_price_to_be_paid_for_booking_confirmation
                  )
                )
            );

      return await mailFunction(
        booking_id,
        checkBookingData.indentorDetails.name,
        checkBookingData.indentorDetails.email,
        paymentAmount,
        checkBookingData.arrivalDate,
        checkBookingData.departureDate,
        checkBookingData.roomDetails.roomNo,
        checkBookingData.roomDetails.roomType,
        res
      );
    } else {
      return responseHandler(res, false, 500, error_occurred);
    }
  } catch (error) {
    console.log(
      `Some error occurend while approving the booking request: ${error.message}`
    );
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default approval;
