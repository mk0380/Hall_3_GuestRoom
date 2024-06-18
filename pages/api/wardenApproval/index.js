import {
  error_occurred,
  internal_server_error,
  invalid_request_method,
  percentage_price_to_be_paid_for_booking_confirmation,
  req_accepted,
  req_rejected,
  validation_error,
} from "@/important_data/important_data";
import { approvalEmail } from "@/mailing/approvalEmail";
import guestRoom from "@/models/BookingDetails";
import connectDB from "@/utils/connectDB";
import responseHandler from "@/utils/responseHandler";
const { bookingIdSchema } = require("@/utils/inputValidation");


const wardenApproval = async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return responseHandler(res, false, 400, invalid_request_method);
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

    await connectDB()

    const checkBookingData = await guestRoom.findOne({ bookingId: booking_id })

    if(!checkBookingData){
        return responseHandler(res, false, 500, error_occurred);
    }

    if(checkBookingData.approvalLevel === "-1"){
        return responseHandler(res, false, 409, req_rejected);
    }

    if(checkBookingData.approvalLevel === "2"){
        return responseHandler(res, false, 409, req_accepted);
    }

    const bookingData = await guestRoom.findOneAndUpdate({ bookingId: booking_id }, { approvalLevel: "2" })

    if(!bookingData){
        return responseHandler(res, false, 500, error_occurred);
    }

    return await approvalEmail(bookingData.indentorDetails.email, parseInt(Math.ceil(bookingData.totalCost * percentage_price_to_be_paid_for_booking_confirmation)), bookingData.indentorDetails.name, bookingData.bookingId, res)


  } catch (error) {
    console.log(error.message);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default wardenApproval;
