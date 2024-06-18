"use client";

import { useState } from "react";
import Loader from "@/components/loader";
import IframeLoader from "@/components/iframeLoader";
import Head from "next/head";
import { feedback_form_link } from "@/important_data/important_data";

const Feedback = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Head>
        <title>Feedback Form</title>
      </Head>
      <div>
        {loading && <Loader />}
        <IframeLoader
          pdf_link={feedback_form_link}
          setLoading={setLoading}
          loading={loading}
        />
      </div>
    </>
  );
};

export default Feedback;
