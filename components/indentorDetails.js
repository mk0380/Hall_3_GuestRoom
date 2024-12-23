"use client";

import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { FormDetails, formInitialState } from "@/context/FormContext";
import FormBox from "./formBox";
import {
  indentor_details_checkbox_1,
  indentor_details_checkbox_2,
} from "@/important_data/important_data";

const IndentorDetails = ({ tabChange, tab }) => {
  const router = useRouter();

  const { form, setForm } = useContext(FormDetails);

  const [check1, setcheck1] = useState(false);
  const [check2, setcheck2] = useState(false);
  const [otp, setOtp] = useState(false);
  const [otp_password, setOtp_password] = useState("");
  const [requestId, setRequestId] = useState("");
  const [disableOTP, setDisableOTP] = useState(false);

  const changeHandler = (ev) => {
    const { name, value } = ev.target;
    const [section, key] = name.split(".");
    setForm((prevForm) => ({
      ...prevForm,
      [section]: {
        ...prevForm[section],
        [key]: value,
      },
    }));
  };

  useEffect(() => {}, [form]);

  const checkIndentorField = (name) => {
    const detail = form?.indentor_details?.[name] ?? "";

    if (name === "email") {
      return (
        (detail ?? "").trim().length === 0 ||
        (detail ?? "")
          .trim()
          .substring((detail ?? "").length - 10, (detail ?? "").length) !==
          "iiiiitk.ac.in"
      );
    } else if (name === "phone") {
      return (
        (detail ?? "").trim().length === 0 ||
        (detail ?? "").trim().length !== 10
      );
    }

    return detail.trim().length === 0;
  };

  const checkValidForm = () => {
    return (
      checkIndentorField("email") ||
      checkIndentorField("name") ||
      checkIndentorField("phone") ||
      checkIndentorField("roll") ||
      !check1 ||
      !check2
    );
  };

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const btnHandler = async(route)=>{
    try {
      const payload = route === 'details'? JSON.stringify(form):{
        otp_password,
        requestId
      }
      const { data } = await axios.post(
        `/api/${route}`,
        payload,
        config
      );
      if(route === 'checkOTP'){
        setOtp_password("");
      }
      if (data?.success ?? false) {
        if(route === 'details'){
          setOtp(true);
          setRequestId(data.id);
        }else{
          setDisableOTP(true);
          router.push("/");
          localStorage.clear();
          setForm(formInitialState);
        }
        toast.success(data.message, { toastId: `${route}_1` });
      } else {
        toast.error(data.message, { toastId: `${route}_2` });
      }      
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error.message, {
        toastId: `${route}_3`,
      });
    }
  }

  return (
    <div className={"" + (tab === "1" || tab === "2" ? "hidden" : "")}>
      <FormBox>
        <TextField
          required
          name="indentor_details.name"
          type="text"
          disabled={otp}
          value={form?.indentor_details?.name ?? ""}
          onChange={changeHandler}
          error={checkIndentorField("name") ?? true}
          label="Name"
        />
        <TextField
          required
          label="Roll No"
          type="number"
          name="indentor_details.roll"
          disabled={otp ?? true}
          value={form?.indentor_details?.roll ?? ""}
          onChange={changeHandler}
          error={checkIndentorField("roll") ?? true}
        />
      </FormBox>
      <FormBox>
        <TextField
          required
          label="Email (IITK)"
          type="email"
          name="indentor_details.email"
          value={form?.indentor_details?.email ?? ""}
          disabled={otp ?? true}
          onChange={changeHandler}
          error={checkIndentorField("email") ?? true}
        />
        <TextField
          required
          label="Phone"
          type="number"
          name="indentor_details.phone"
          disabled={otp ?? true}
          value={form?.indentor_details?.phone ?? ""}
          onChange={changeHandler}
          error={checkIndentorField("phone") ?? true}
        />
      </FormBox>
      <FormBox>
        <p style={{ margin: "1rem", fontWeight: "600" }}>
          Booking request OTP will be send to : <span>&nbsp;</span>
          <span style={{ fontWeight: "bold" }}>
            {form?.indentor_details?.email ?? ""}
          </span>
        </p>
      </FormBox>
      <FormBox>
        <FormGroup style={{ display: otp ? "none" : "" }}>
          <FormControlLabel
            className="info"
            checked={check1}
            control={
              <Checkbox value={check1} onChange={(_) => setcheck1(!check1)} />
            }
            label={indentor_details_checkbox_1}
          />
          <FormControlLabel
            className="info"
            checked={check2}
            control={
              <Checkbox value={check2} onChange={(_) => setcheck2(!check2)} />
            }
            label={indentor_details_checkbox_2}
          />
        </FormGroup>
        <FormGroup style={{ display: otp ? "" : "none" }}>
          <TextField
            required
            label="OTP"
            type="text"
            name="otp_password"
            disabled={disableOTP ?? true}
            value={otp_password ?? ""}
            onChange={(ev) => setOtp_password(ev.target.value)}
            error={otp_password.trim().length === 0 ?? true}
          />
        </FormGroup>
      </FormBox>
      <FormBox>
        <Button
          variant="outlined"
          disabled={otp ?? true}
          style={{ marginRight: "1rem", marginTop: "0.5rem" }}
          className="btns"
          onClick={(_) => tabChange("2")}
        >
          Prev
        </Button>
        {!otp && (
          <Button
            variant="outlined"
            disabled={checkValidForm() ?? true}
            style={{ marginTop: "0.5rem" }}
            className="btns"
            onClick={() => btnHandler('details')}
          >
            Submit
          </Button>
        )}
        {otp && (
          <Button
            variant="outlined"
            disabled={otp_password?.trim()?.length === 0 ?? true}
            style={{ marginTop: "0.5rem" }}
            className="btns"
            onClick={() => btnHandler('checkOTP')}
          >
            Check
          </Button>
        )}
      </FormBox>
    </div>
  );
};

export default IndentorDetails;
