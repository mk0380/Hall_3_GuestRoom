"use client";

import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

const HomeButtons = () => {
  const router = useRouter();

  const btnData = [
    {
      name: "Book Room",
      nav: "/checkDates",
    },
    {
      name: "Prices",
      nav: "/prices",
    },
    {
      name: "Rules",
      nav: "/rules",
    },
    {
      name: "Feedback",
      nav: "/feedback",
    },
    {
      name: "Cancel room",
      nav: "/cancelRoom",
    },
  ];

  return (
    <div className="buttons">
      {btnData.map((data, indx) => (
        <Button
          variant="outlined"
          className="btns"
          onClick={() => router.push(data.nav)}
          key={indx}
        >
          {data.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeButtons;
