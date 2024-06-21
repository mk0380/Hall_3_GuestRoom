"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/loader";
import { wrongURL_redirect_timer } from "@/important_data/important_data";

const PageNotFound = () => {
  const navigate = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate.push("/");
      clearTimeout(timeout);
    }, wrongURL_redirect_timer);
  }, []);

  return <Loader />;
};

export default PageNotFound;
