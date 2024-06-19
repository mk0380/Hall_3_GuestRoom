"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { useRouter } from "next/router";
import Heading from "@/components/heading";
import RoomsDetails from "@/components/roomDetails";
import VisitorDetails from "@/components/visitorDetails";
import IndentorDetails from "@/components/indentorDetails";

const Tabs = () => {
  const router = useRouter();

  const [value, setValue] = useState("1");

  useEffect(() => {
    if (
      localStorage.getItem("room") == null ||
      localStorage.getItem("arrivalDate") == null ||
      localStorage.getItem("departureDate") == null
    ) {
      router.push("/checkDates");
    }
  }, []);

  return (
    <div className="home">
      <div className="container">
        <Heading />
        <div className="forms">
          <h5 className="req_fields">Note: All fields with * are required</h5>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  marginBottom: "1.5rem",
                }}
              >
                <TabList aria-label="lab API tabs example">
                  <Tab label="Room Details" value="1" />
                  <Tab label="Visitor Details" value="2" />
                  <Tab label="Indentor's Details" value="3" />
                </TabList>
              </Box>
                <RoomsDetails tab={value} tabChange={setValue} />
                <VisitorDetails tab={value} tabChange={setValue} />
                <IndentorDetails tab={value} tabChange={setValue} />
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
