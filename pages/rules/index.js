"use client";

import Loader from "@/components/loader";
import IframeLoader from "@/components/iframeLoader";
import { useState } from "react";
import Head from "next/head";
import { rules_pdf_link } from "@/important_data/important_data";

const Rules = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Head>
        <title>Rules & Regulations</title>
      </Head>
      <div>
        {loading && <Loader />}
        <IframeLoader
          pdf_link={rules_pdf_link}
          setLoading={setLoading}
          loading={loading}
        />
      </div>
    </>
  );
};

export default Rules;
