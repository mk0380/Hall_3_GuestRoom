"use client";

import { useState, lazy, Suspense } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Button } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Heading from "@/components/heading";
import {
  max_booking_day_period,
  room_details,
} from "@/important_data/important_data";
import { toast } from "react-toastify";
import Loader from "@/components/loader";

const LazyCheckDates = lazy(() => import("@/components/lazyCheckDates"));

const CheckDates = () => {
  
  // R1 R2  ... of a particular date   -1 = Red = booked, 0  = yellow = reserved, 1 = green = available
  const [datesState, setDatesState] = useState({
    arrivalDate: null,
    departureDate: null,
    colorList: [],
    datesColor: [],
    room: "",
    display: false,
  });

  const { arrivalDate, departureDate, colorList, datesColor, room, display } =
    datesState;

  const checkDateSpan = () => {
    if (!arrivalDate || !departureDate) {
      return true;
    } else {
      const d1 = dayjs(arrivalDate);
      const d2 = dayjs(departureDate);
      const today = dayjs();
      const noOfDays = d2.diff(d1, "day");
      if (
        noOfDays > max_booking_day_period ||
        d1 > d2 ||
        d1.isBefore(today, "day")
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const checkStatus = async () => {
    try {
      const { data } = await axios.post(
        "/api/checkDates",
        { arrivalDate, departureDate },
        config
      );

      if (data.success) {
        setDatesState({
          ...datesState,
          colorList: data.payload.color,
          datesColor: data.payload.dates,
          display: true,
        });
        localStorage.setItem("arrivalDate", data.payload.arrivalDate);
        localStorage.setItem("departureDate", data.payload.departureDate);
      } else {
        toast.error(data.message, { toastId: "check_dates_1" });
      }
    } catch (error) {
      toast.error(error.message, { toastId: "check_dates_2" });
    }
  };

  const router = useRouter();

  const routing = () => {
    localStorage.setItem("room", room);
    router.push("/formFillup");
  };

  const unique_room = room_details

  return (
    <div className="home checkDatesSection">
      <div className="container">
        <Heading />
        <div className="checkDates">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              disablePast
              format="DD/MM/YYYY"
              label="From :"
              onChange={(date) =>
                setDatesState({ ...datesState, arrivalDate: date })
              }
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {arrivalDate && (
              <DatePicker
                minDate={arrivalDate}
                maxDate={dayjs(arrivalDate).add(max_booking_day_period, "day")}
                format="DD/MM/YYYY"
                label="To :"
                onChange={(date) =>
                  setDatesState({ ...datesState, departureDate: date })
                }
              />
            )}
          </LocalizationProvider>
          <Button
            variant="outlined"
            disabled={checkDateSpan()}
            className="btn btns"
            onClick={checkStatus}
          >
            Check Availability
          </Button>
        </div>

        <Suspense fallback={<Loader />}>
          <LazyCheckDates display={display} routing={routing} setDatesState={setDatesState} room={room} datesColor={datesColor} colorList={colorList} datesState={datesState}/>
        </Suspense>
      </div>
    </div>
  );
};

export default CheckDates;
