import {
  error_occurred,
  internal_server_error,
  invalid_request_method,
  percentage_price_to_be_paid_for_booking_confirmation,
} from "@/important_data/important_data";
import connectDB from "@/utils/connectDB";
import responseHandler from "@/utils/responseHandler";
const bookingSchema = require("@/models/BookingDetails");

const fetchData = async (req, res) => {
  try {
    if (req.method !== "GET") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    const { success_db, message_db } = await connectDB();
    if (!success_db) {
      return responseHandler(res, false, 503, message_db);
    }

    let allData = await bookingSchema.find({});

    if (!allData) {
      return responseHandler(res, false, 500, error_occurred);
    }

    for (let index = 0; index < allData.length; index++) {
      allData[index].totalCost =
        "₹" +
        parseInt(
          Math.ceil(
            allData[index].totalCost *
              percentage_price_to_be_paid_for_booking_confirmation
          )
        ) +
        " + " +
        "₹" +
        parseInt(
          allData[index].totalCost -
            parseInt(
              Math.ceil(
                allData[index].totalCost *
                  percentage_price_to_be_paid_for_booking_confirmation
              )
            )
        );

      allData[index].status =
        allData[index].approvalLevel === "-1"
          ? "Rejected"
          : allData[index].approvalLevel === "2"
          ? ""
          : allData[index].approvalLevel === "3"
          ? "Payment 1 Done"
          : allData[index].approvalLevel === "4"
          ? "Paid"
          : "";
    }

    return responseHandler(res, true, 200, "", { allData });
  } catch (error) {
    console.error(
      `Error during during fetching of the dashboard data: ${error.message}`
    );
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default fetchData;
