"use client";

import { useState } from "react";
import Loader from "@/components/loader";
import IframeLoader from "@/components/iframeLoader";
import Head from "next/head";
import { cancel_room_pdf_link } from "@/important_data/important_data";

const CancelRoom = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Head>
        <title>Cancellation Policy</title>
      </Head>
      <div>
        {loading && <Loader />}
        <IframeLoader
          pdf_link={cancel_room_pdf_link}
          setLoading={setLoading}
          loading={loading}
        />
      </div>
    </>
  );
};

export default CancelRoom;
