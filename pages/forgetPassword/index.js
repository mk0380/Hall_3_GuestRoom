"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useCheckLoggedIn from "@/utils/checkLoggedIn";
import Heading from "@/components/heading";
import FormButton from "@/components/button";
import {
  emailSchema,
  otpSchema,
  passwordSchema,
} from "@/utils/inputValidation";
import FormField from "@/components/textField";

const ForgetPassword = () => {
  const navigate = useRouter();

  const { checkLoggedIn } = useCheckLoggedIn();

  useEffect(() => {
    checkLoggedIn("/forgetPassword", "/dashboard");
  }, []);

  const [disabled, setDisabled] = useState(true);
  const [otpcheck, setOtpcheck] = useState(true);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOTP] = useState("");

  const emailChangeHandler = (ev) => {
    setEmail(ev.target.value);
  };

  const otpChangeHandler = (ev) => {
    setOTP(ev.target.value);
  };

  const newpasswordChangeHandler = (ev) => {
    setNewPassword(ev.target.value);
  };

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const sendOTP = async () => {
    try {
      await emailSchema.validate(
        { email },
        {
          strict: true,
        }
      );
      const { data } = await axios.post(
        "/api/forgetPassword",
        { email },
        config
      );
      if (data.success) {
        setDisabled(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message ?? error.message);
      // all reposonse with status codes outside the range of 2xx will move to the catch block
    }
  };

  const validateOTP = async () => {
    try {
      await otpSchema.validate(
        { otp },
        {
          strict: true,
        }
      );
      const { data } = await axios.post(
        "/api/validateOTP",
        { email, otp },
        config
      );
      if (data.success) {
        setOtpcheck(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message ?? error.message);
      // all reposonse with status codes outside the range of 2xx will move to the catch block
    }
  };

  const passwordChangeHandler = async () => {
    try {
      await passwordSchema.validate(
        { password: newPassword },
        {
          strict: true,
        }
      );
      const { data } = await axios.put(
        "/api/passwordChange",
        { email, newPassword },
        config
      );
      if (data.success) {
        navigate.push("/login");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message ?? error.message);
      // all reposonse with status codes outside the range of 2xx will move to the catch block
    }
  };

  return (
    <div className="home">
      <div className="container">
        <Heading />
        <div className="login">
          <h2>Forget Password</h2>

          <FormField
            label={"Email"}
            type={"email"}
            name={"email"}
            disabled={!disabled}
            onChange={emailChangeHandler}
            value={email}
            m={2}
            width={"25ch"}
          />

          <FormButton onClick={sendOTP} disabled={!disabled}>
            Send OTP
          </FormButton>
          {otpcheck && (
            <FormField
              label={"OTP"}
              type={"number"}
              name={"email"}
              disabled={disabled}
              onChange={otpChangeHandler}
              value={otp}
              m={2}
              width={"25ch"}
            />
          )}
          {otpcheck && (
            <FormButton onClick={validateOTP} disabled={disabled}>
              Validate OTP
            </FormButton>
          )}

          {!otpcheck && (
            <FormField
              label={"New Password"}
              type={"password"}
              name={"password"}
              onChange={newpasswordChangeHandler}
              value={newPassword}
              m={2}
              width={"25ch"}
            />
          )}
          {!otpcheck && (
            <FormButton onClick={passwordChangeHandler}>
              Set New Password
            </FormButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
