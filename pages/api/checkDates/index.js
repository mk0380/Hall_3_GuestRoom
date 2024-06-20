const guestRoom = require("@/models/BookingDetails");
const connectDB = require("@/utils/connectDB");
const { dateSchema } = require("@/utils/inputValidation");
const {
  internal_server_error,
  invalid_request_method,
  validation_error,
  room_details,
  max_booking_day_period,
  date_incorrcet,
  error_occurred,
} = require("@/important_data/important_data");
const responseHandler = require("@/utils/responseHandler");
const moment = require("moment");
const dayjs = require("dayjs");
// const utc = require('dayjs/plugin/utc');
// const timezone = require('dayjs/plugin/timezone');

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault('Asia/Kolkata');

const checkDates = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    let { arrivalDate, departureDate } = req.body;

    try {
      await dateSchema.validate(
        { date: arrivalDate },
        {
          strict: true,
        }
      );
      await dateSchema.validate(
        { date: departureDate },
        {
          strict: true,
        }
      );
    } catch (error) {
      return responseHandler(res, false, 400, validation_error(error.message));
    }

    const d1 = dayjs(arrivalDate)
    const d2 = dayjs(departureDate)
    const today = dayjs()
    const noOfDays = d2.diff(d1, "day");

    if (
      noOfDays > max_booking_day_period ||
      d1 > d2 ||
      d1.isBefore(today, "day")
    ) {
      return responseHandler(res, false, 401, date_incorrcet);
    }

    arrivalDate = moment(arrivalDate)
    departureDate = moment(departureDate);

    // console.log('arrival Date', arrivalDate);

    await connectDB(res);

    const allBookings = await guestRoom
      .find({})
      .select(["arrivalDate", "departureDate", "roomDetails", "approvalLevel"]);

    if (!allBookings) {
      return responseHandler(res, false, 500, error_occurred);
    }

    const arrivalDates = allBookings.map((booking) =>
      moment(booking.arrivalDate, "DD/MM/YYYY", true)
    );
    const departureDates = allBookings.map((booking) =>
      moment(booking.departureDate, "DD/MM/YYYY", true)
    );
    const roomNos = allBookings.map((booking) => booking.roomDetails.roomNo);
    const approvalLevel = allBookings.map((booking) => booking.approvalLevel);

    let colorList = [];
    let dates = [];

    while (arrivalDate.isSameOrBefore(departureDate)) {
      const date = arrivalDate.format("DD/MM/YYYY");

      dates.push(
        date.substring(0, date.length - 4) +
          date.substring(date.length - 2, date.length)
      );

      const color = new Array(room_details?.length).fill("1");

      for (let index = 0; index < arrivalDates.length; index++) {
        if (
          arrivalDates[index].isValid() &&
          departureDates[index].isValid() &&
          arrivalDates[index].isSameOrBefore(arrivalDate) &&
          departureDates[index].isSameOrAfter(arrivalDate)
        ) {
          const roomIndex = roomNos.indexOf(roomNos[index]);

          if (roomIndex !== -1) {
            if (approvalLevel[index] === "1" || approvalLevel[index] === "2") {
              color[roomIndex] = "0";
            } else if (
              approvalLevel[index] === "3" ||
              approvalLevel[index] === "4"
            ) {
              color[roomIndex] = "-1";
            }
          }
        }
      }

      colorList.push(color);
      arrivalDate.add(1, "day");
    }

    const payload = {
      arrivalDate: moment(req.body.arrivalDate).format("DD/MM/YYYY"),
      departureDate: moment(req.body.departureDate).format("DD/MM/YYYY"),
      color: colorList,
      dates,
    };

    return responseHandler(res, true, 200, "", payload);
  } catch (error) {
    console.log(`Error occured while checking dates: ${error.message}`);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default checkDates;
