import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Welcome to the Guest Room Booking Portal for Hall of Residence 3 at IIT Kanpur. Book comfortable rooms for your stay, conveniently located within the campus. Experience a relaxing stay with our well-furnished rooms and convenient amenities."
        />
        <link rel="icon" href="hall3.webp" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
