import FormContext from "@/context/FormContext";
import UserContext from "@/context/UserContext";
import { toast_timer } from "@/important_data/important_data";
import "@/styles/app.css";
import "@/styles/mediaQuery.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Guest Room Booking Portal</title>
      </Head>
      <FormContext>
        <UserContext>
          <Component {...pageProps} />
        </UserContext>
      </FormContext>
      <ToastContainer autoClose={toast_timer}/>
    </>
  );
}
