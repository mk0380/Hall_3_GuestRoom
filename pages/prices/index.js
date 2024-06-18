"use client";

import { useState } from "react";
import Loader from "@/components/loader";
import IframeLoader from "@/components/iframeLoader";
import Head from "next/head";
import { prices_pdf_link } from "@/important_data/important_data";

const Prices = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Head>
        <title>Pricing Details</title>
      </Head>
      <div>
        {loading && <Loader />}
        <IframeLoader
          pdf_link={prices_pdf_link}
          setLoading={setLoading}
          loading={loading}
        />
      </div>
    </>
  );
};

export default Prices;
