"use client"

import { TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useCheckLoggedIn from "@/utils/checkLoggedIn";
import Heading from "@/components/heading";
import { LoggedInUser } from "@/context/UserContext";
import { emailSchema, otpSchema, userSchema } from "@/utils/inputValidation";
import FormBox2 from "@/components/formBox2";

const ChangePassword = () => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOTP] = useState("");

  const { admin } = useContext(LoggedInUser);

  const { checkLoggedIn } = useCheckLoggedIn();

  useEffect(() => {
    checkLoggedIn('/login','/dashboard');
  }, []);

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const validateOTP = async () => {
    try {
      await otpSchema.validate(
        { otp },
        {
          strict: true,
        }
      );

      await userSchema.validate(
        { email: admin.email, password: newPassword },
        {
          strict: true,
        }
      );

      const { data } = await axios.put(
        "/api/setPasswordValidateOTP",
        { otp, email: admin.email, password: newPassword },
        config
      );
      if (data?.success) {
        router.push("/dashboard");
        toast.success(data.message, { toastId: "setPasswordValidateOTP_1" });
      } else {
        toast.error(data.message, { toastId: "setPasswordValidateOTP_2" });
      }
    } catch (error) {
      toast.error(error.response?.data.message ?? error.message, {
        toastId: "setPasswordValidateOTP_3",
      });
    }
  };

  const passwordChangeHandler = async () => {
    try {
      await emailSchema.validate(
        { email: admin.email },
        {
          strict: true,
        }
      );

      const { data } = await axios.post(
        "/api/setPassword",
        { email: admin.email },
        config
      );

      if (data?.success) {
        setDisabled(true);
        toast.success(data.message, { toastId: "setPassword_1" });
      } else {
        toast.error(data.message, { toastId: "setPassword_2" });
      }
    } catch (error) {
      toast.error(error.response?.data.message ?? error.message, {
        toastId: "setPassword_3",
      });
    }
  };

  return (
    <div className="home">
      <div className="container">
        <Heading />
        <div className="login">
          <h2>Change Password</h2>
          <FormBox2>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              disabled={disabled}
              onChange={(ev) => setNewPassword(ev.target.value)}
              InputProps={{
                readOnly: false,
              }}
            />
          </FormBox2>
          <FormBox2>
            <Button
              variant="outlined"
              className="btns"
              disabled={disabled ?? true}
              onClick={passwordChangeHandler}
            >
              Change Password
            </Button>
          </FormBox2>
          <FormBox2>
            <TextField
              label="OTP"
              type="number"
              disabled={!disabled ?? true}
              value={otp ?? ""}
              onChange={(ev) => setOTP(ev.target.value)}
              InputProps={{
                readOnly: false,
              }}
            />
          </FormBox2>
          <FormBox2>
            <Button
              variant="outlined"
              className="btns"
              disabled={!disabled ?? true}
              onClick={validateOTP}
            >
              Validate OTP
            </Button>
          </FormBox2>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
