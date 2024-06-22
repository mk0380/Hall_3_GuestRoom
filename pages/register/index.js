"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Heading from "@/components/heading";
import FormButton from "@/components/button";
import FormField from "@/components/textField";
import useCheckLoggedIn from "@/utils/checkLoggedIn";

const Register = () => {
  const router = useRouter();

  const { checkLoggedIn } = useCheckLoggedIn();

  useEffect(() => {
    checkLoggedIn("/register", "/dashboard");
  }, []);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (ev) => {
    setUser({
      ...user,
      [ev.target.name]: ev.target.value,
    });
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const register = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("/api/register", user, config);
      if (data?.success) {
        router.push("/dashboard");
        toast.success(data.message, { toastId: "register_1" });
      } else {
        toast.error(data.message, { toastId: "register_2" });
      }
    } catch (error) {
      toast.error(error.response?.data.message ?? error.message, {
        toastId: "register_3",
      });
      // all reposonse with status codes outside the range of 2xx will move to the catch block
    }
  };

  return (
    <div className="home">
      <div className="container">
        <Heading />
        <div className="login">
          <h2>Register</h2>
          <FormField
            label={"Email"}
            type={"email"}
            name={"email"}
            value={user.email}
            onChange={changeHandler}
            m={1}
            width={"25ch"}
          />
          <FormField
            label={"Password"}
            type={"password"}
            name={"password"}
            value={user.password}
            onChange={changeHandler}
            marginBottom={2}
            width={"25ch"}
          />
          <FormButton onClick={register}>Register</FormButton>
          <div
            className="forget"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Link href={"/login"} style={{ fontWeight: "600" }}>
              Login
            </Link>
            <Link href={"/forgetPassword"} style={{ fontWeight: "600" }}>
              Forget Password ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
