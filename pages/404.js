"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/loader";

const PageNotFound = () => {
  const navigate = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate.push("/");
      clearTimeout(timeout);
    }, 4000);
  }, []);

  return <Loader />;
};

export default PageNotFound;
