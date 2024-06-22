import schemaValidator from "@/utils/schemaValidator";
const guestRoom = require("@/models/BookingDetails");
const connectDB = require("@/utils/connectDB");
const { dateSchema } = require("@/utils/inputValidation");
const {
  internal_server_error,
  invalid_request_method,
  room_details,
  max_booking_day_period,
  date_incorrcet,
  error_occurred,
  timezone_date,
} = require("@/important_data/important_data");
const responseHandler = require("@/utils/responseHandler");
const moment = require("moment-timezone");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(timezone_date);

const checkDates = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return responseHandler(res, false, 400, invalid_request_method);
    }

    let { arrivalDate, departureDate } = req.body;

    arrivalDate = dayjs
      .tz(arrivalDate, "UTC")
      .tz(timezone_date)
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    departureDate = dayjs
      .tz(departureDate, "UTC")
      .tz(timezone_date)
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    const { success, message } = await schemaValidator(
      dateSchema,
      "date",
      arrivalDate
    );
    if (!success) {
      return responseHandler(res, false, 401, message);
    }

    const { success: success2, message: message2 } = await schemaValidator(
      dateSchema,
      "date",
      departureDate
    );
    if (!success2) {
      return responseHandler(res, false, 401, message2);
    }

    const d1 = dayjs.tz(arrivalDate, timezone_date);
    const d2 = dayjs.tz(departureDate, timezone_date);
    const today = dayjs().tz(timezone_date);
    const noOfDays = d2.diff(d1, "day");

    if (
      noOfDays > max_booking_day_period ||
      d1 > d2 ||
      d1.isBefore(today, "day")
    ) {
      return responseHandler(res, false, 401, date_incorrcet);
    }

    arrivalDate = moment(arrivalDate).tz(timezone_date);
    departureDate = moment(departureDate).tz(timezone_date);

    const { success_db, message_db } = await connectDB();
    if (!success_db) {
      return responseHandler(res, false, 503, message_db);
    }
    
    const allBookings = await guestRoom
      .find({})
      .select(["arrivalDate", "departureDate", "roomDetails", "approvalLevel"]);

    if (!allBookings) {
      return responseHandler(res, false, 500, error_occurred);
    }

    const arrivalDates = allBookings.map((booking) =>
      moment(booking.arrivalDate, "DD/MM/YYYY", true).tz(timezone_date)
    );

    const departureDates = allBookings.map((booking) =>
      moment(booking.departureDate, "DD/MM/YYYY", true).tz(timezone_date)
    );

    const roomNos = allBookings.map((booking) => booking.roomDetails.roomNo);

    const approvalLevel = allBookings.map((booking) => booking.approvalLevel);

    let colorList = [];
    let dates = [];

    const roomIndexMap = room_details.reduce((map, room, index) => {
      map[room.no] = index;
      return map;
    }, {});

    while (arrivalDate.isSameOrBefore(departureDate)) {
      const date = arrivalDate.tz(timezone_date).format("DD/MM/YYYY");
      const color = new Array(room_details?.length).fill("1");

      dates.push(
        date.substring(0, date.length - 4) +
          date.substring(date.length - 2, date.length)
      );

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

        if (
          formattedArrivalDate.isValid() &&
          formattedDate.isValid() &&
          formattedDepartureDate.isValid() &&
          formattedArrivalDate.isSameOrBefore(formattedDate) &&
          formattedDepartureDate.isSameOrAfter(formattedDate)
        ) {
          const roomIndex = roomIndexMap[roomNos[index]];
          if (roomIndex !== undefined) {
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
      arrivalDate = arrivalDate.tz(timezone_date).add(1, "day");
    }

    const payload = {
      arrivalDate: moment(req.body.arrivalDate)
        .tz(timezone_date)
        .format("DD/MM/YYYY"),
      departureDate: moment(req.body.departureDate)
        .tz(timezone_date)
        .format("DD/MM/YYYY"),
      color: colorList,
      dates,
    };

    return responseHandler(res, true, 200, "", payload);
  } catch (error) {
    console.log(`Error occured while checking dates: ${error}`);
    return responseHandler(res, false, 500, internal_server_error);
  }
};

export default checkDates;
