"use client";

import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { FormDetails } from "@/context/FormContext";
import {
  max_number_persons_message,
  room_details,
} from "@/important_data/important_data";
import FormBox from "./formBox";

const RoomsDetails = ({ tabChange, tab }) => {
  const { form, setForm } = useContext(FormDetails);
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const arrivalDateFromStorage = localStorage.getItem("arrivalDate");
    const departureDateFromStorage = localStorage.getItem("departureDate");
    const roomFromStorage = localStorage.getItem("room");

    if (arrivalDateFromStorage || departureDateFromStorage || roomFromStorage) {
      setForm((prevForm) => ({
        ...prevForm,
        room_details: {
          ...prevForm.room_details,
          arrival_date:
            arrivalDateFromStorage || prevForm.room_details.arrival_date,
          departure_date:
            departureDateFromStorage || prevForm.room_details.departure_date,
          room_no:
            roomFromStorage?.split(" ")[0] || prevForm.room_details.room_no,
          room_type:
            roomFromStorage?.split(" ")[1] || prevForm.room_details.room_type,
        },
      }));
    }
  }, [setForm]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      const room = room_details?.find(
        (data) => data.no === form.room_details.room_no
      );
      setRoomData(room);
    };

    fetchRoomDetails();
  }, [roomData]);

  const changeHandler = (ev) => {
    let { name, value } = ev.target;
    let nameArr = [""],
      phoneArr = [""],
      relationshipArr = [""];
    if (value && value > 0) {
      nameArr = [...Array(parseInt(value))].fill("");
      phoneArr = [...Array(parseInt(value))].fill("");
      relationshipArr = [...Array(parseInt(value))].fill("");
    }
    if(value < 0){
      return
    }
    const [section, key] = name.split(".");
    setForm((prevForm) => ({
      ...prevForm,
      [section]: {
        ...prevForm[section],
        [key]: value,
      },
      visitor_details: {
        ...prevForm["visitor_details"],
        name: nameArr,
        phone: phoneArr,
        relationship: relationshipArr,
      },
    }));
  };

  useEffect(() => {}, [form]);

  const roomType = roomData?.beds ?? "";

  const checkNoOfPerson = () => {
    const { no_of_persons } = form?.room_details;
    const max_persons = roomData?.max_persons ?? 0;
    return no_of_persons > max_persons || no_of_persons <= 0;
  };

  return (
    <div className={tab === "3" || tab === "2" ? "hidden" : ""}>
      <FormBox>
        <TextField
          label="ROOM NUMBER"
          value={form?.room_details?.room_no ?? ""}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="ROOM TYPE"
          value={roomType ?? ""}
          InputProps={{ readOnly: true }}
        />
      </FormBox>
      <FormBox>
        <TextField
          label="ARRIVAL DATE"
          value={form?.room_details?.arrival_date ?? "DD/MM/YYYY"}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="DEPARTURE DATE"
          value={form?.room_details?.departure_date ?? "DD/MM/YYYY"}
          InputProps={{ readOnly: true }}
        />
      </FormBox>
      <div style={{ display: "flex" }}>
        <FormBox width={"130%"}>
          <TextField
            label="Number of Persons"
            name="room_details.no_of_persons"
            type="number"
            required
            error={checkNoOfPerson() ?? true}
            value={form?.room_details?.no_of_persons ?? 0}
            onChange={changeHandler}
            InputLabelProps={{ shrink: true }}
          />
        </FormBox>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
          className="tool_tip"
        >
          <Tooltip
            title={`${max_number_persons_message} ${roomData?.max_persons}.`}
            arrow
          >
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 2, width: "25ch" },
          "@media (max-width: 400px)": {
            "& .MuiTextField-root": {
              m: 1,
              width: "22ch",
            },
          },
        }}
        noValidate
        autoComplete="off"
      >
        <Button
          variant="outlined"
          disabled={checkNoOfPerson() ?? true}
          className="btns"
          onClick={() => tabChange("2")}
        >
          Next
        </Button>
      </Box>
    </div>
  );
};

export default RoomsDetails;
