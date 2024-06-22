"use client";

import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useCheckLoggedIn from "@/utils/checkLoggedIn";
import Heading from "@/components/heading";
import FormBox2 from "@/components/formBox2";

const ChangePassword = () => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOTP] = useState("");

  const { checkLoggedIn } = useCheckLoggedIn();

  useEffect(() => {
    checkLoggedIn("/login", "/changePassword");
  }, []);

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const btnHandler = async (route) => {
    try {
      const payload = {
        otp,
        password: newPassword,
      };

      const method = route === "setPasswordValidateOTP" ? "put" : "post";

      const { data } = await axios({
        method: method,
        url: `/api/${route}`,
        data: route === "setPassword" ? {} : payload,
        ...config,
      });

      if (data?.success ?? false) {
        if (route === "setPasswordValidateOTP") {
          router.push("/dashboard");
        } else {
          setDisabled(true);
        }
        toast.success(data.message, { toastId: `${route}_1` });
      } else {
        toast.error(data.message, { toastId: `${route}_2` });
      }
    } catch (error) {
      toast.error(error.response?.data.message ?? error.message, {
        toastId: `${route}_3`,
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
              disabled={disabled ?? true}
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
              onClick={() => btnHandler("setPassword")}
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
              onClick={() => btnHandler("setPasswordValidateOTP")}
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
