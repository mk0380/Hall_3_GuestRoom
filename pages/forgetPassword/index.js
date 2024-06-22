"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useCheckLoggedIn from "@/utils/checkLoggedIn";
import Heading from "@/components/heading";
import FormButton from "@/components/button";
import FormField from "@/components/textField";

const ForgetPassword = () => {
  const router = useRouter();

  const { checkLoggedIn } = useCheckLoggedIn();

  useEffect(() => {
    checkLoggedIn("/forgetPassword", "/dashboard");
  }, []);

  const [disabled, setDisabled] = useState(true);
  const [otpcheck, setOtpcheck] = useState(true);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOTP] = useState("");

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const btnHandler = async (route) => {
    try {
      const payload = {
        email,
      };
      if (route === "validateOTP") {
        payload.otp = otp;
      } else if (route === "passwordChange") {
        payload.newPassword = newPassword;
      }

      const method = route === "passwordChange" ? "put" : "post";

      const { data } = await axios({
        method: method,
        url: `/api/${route}`,
        data: payload,
        ...config
      });
      
      if (data?.success ?? false) {
        if (route === "forgetPassword") {
          setDisabled(false);
        } else if (route === "validateOTP") {
          setOtpcheck(false);
        } else {
          router.push("/login");
        }
        toast.success(data.message, { toastId: `${route}_1` });
      } else {
        toast.error(data.message, { toastId: `${route}_2` });
      }
    } catch (error) {
      toast.error(error.response?.data?.message ?? error.message, {
        toastId: `${route}_3`,
      });
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
            disabled={!disabled ?? true}
            onChange={(ev) => setEmail(ev.target.value)}
            value={email ?? ""}
            m={2}
            width={"25ch"}
          />

          <FormButton
            onClick={() => btnHandler("forgetPassword")}
            disabled={!disabled}
          >
            Send OTP
          </FormButton>
          {otpcheck && (
            <FormField
              label={"OTP"}
              type={"number"}
              name={"email"}
              disabled={disabled ?? true}
              onChange={(ev) => setOTP(ev.target.value)}
              value={otp}
              m={2}
              width={"25ch"}
            />
          )}
          {otpcheck && (
            <FormButton
              onClick={() => btnHandler("validateOTP")}
              disabled={disabled ?? true}
            >
              Validate OTP
            </FormButton>
          )}

          {!otpcheck && (
            <FormField
              label={"New Password"}
              type={"password"}
              name={"password"}
              onChange={(ev) => setNewPassword(ev.target.value)}
              value={newPassword ?? ""}
              m={2}
              width={"25ch"}
            />
          )}
          {!otpcheck && (
            <FormButton onClick={() => btnHandler("passwordChange")}>
              Set New Password
            </FormButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
