"use client";

import { useState, useEffect, useContext } from "react";
import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import MaterialTable from "material-table";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { LoggedInUser } from "@/context/UserContext";
import useCheckLoggedIn from "@/utils/checkLoggedIn";
import { code_hall_office, code_warden } from "@/important_data/important_data";
import Heading from "@/components/heading";

const Dashboard = () => {
  const router = useRouter();

  const { admin } = useContext(LoggedInUser);

  const { checkLoggedIn } = useCheckLoggedIn();

  const [tableData, setTableData] = useState([]);

  const [modalData, setModalData] = useState({
    roomDetails: { roomNo: "", roomType: "" },
    arrivalDate: "",
    departureDate: "",
    visitorDetails: [{ name: "", relationship: "", phone: "" }],
    indentorDetails: { name: "", roll: "", email: "", phone: "" },
    purposeOfVisit: "",
    bookingId: "",
    status: "",
    approvalLevel: "",
  });

  const [open, setOpen] = useState(false);
  const [childModal, setChildModal] = useState(false);
  const [reason, setReason] = useState("");

  const initializeUser = async () => {
    await checkLoggedIn("/login", "/dashboard");
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/api/fetchData");

      if (data?.success ?? false) {
        let filteredData = [];
        if (admin?.role === code_warden) {
          filteredData = data?.payload?.allData?.filter(
            (item) => item.approvalLevel === "1"
          );
        } else if (admin?.role === code_hall_office) {
          filteredData = data?.payload?.allData?.filter(
            (item) =>
              item.approvalLevel === "2" ||
              item.approvalLevel === "3" ||
              item.approvalLevel === "4" ||
              item.approvalLevel === "-1"
          );
        }
        setTableData([...filteredData]);
      } else {
        toast.error(data.message, { toastId: "fetchData_1" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message ?? error.message, {
        toastId: "fetchData_2",
      });
    }
  };

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    fetchData();
  }, [admin, open]);

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/logout");

      if (data?.success ?? false) {
        toast.success(data.message, { toastId: "logout_1" });
        router.push("/login");
      } else {
        toast.error(data.message, { toastId: "logout_2" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message ?? error.message, {
        toastId: "logout_3",
      });
    }
  };

  const modalHandler = (id) => {
    if (id === "handleClickOpen") {
      setChildModal(false);
      setOpen(true);
    } else if (id === "handleClose") {
      setOpen(false);
    } else if (id === "rejectHandler2") {
      setOpen(true);
      setChildModal(true);
    }
  };

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const btnHandler = async (route) => {
    try {
      const booking_id = modalData?.bookingId ?? "";

      const payload = {
        booking_id,
      };

      if (route === "rejection") {
        setChildModal(false);
        payload.reason = reason;
      }

      const { data } = await axios.put(`/api/${route}`, payload, config);

      if (route === "rejection") {
        setOpen(false);
      }

      if (data?.success ?? false) {
        toast.success(data.message, { toastId: `${route}_1` });
        if (route === "approval") {
          setOpen(!open);
        }
      } else {
        toast.error(data.message, { toastId: `${route}_2` });
      }
      if (route === "rejection") {
        setReason("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message ?? error.message, {
        toastId: `${route}_3`,
      });
    }
  };

  var style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    overflow: "scroll",
    scrollbarWidth: "none",
  };

  const mediaQueries = {
    "@media (max-width: 768px)": {
      width: "90%",
      height: "90%",
      ".modal_content": {
        display: "flex",
        flexDirection: "column",
        margin: "1rem",
      },
    },
    "@media (max-width: 480px)": {
      width: "95%",
      height: "95%",
      ".modal_content": {
        display: "flex",
        flexDirection: "column",
        margin: "1rem",
      },
    },
  };

  style = { ...style, ...mediaQueries };

  const columns = [
    {
      title: "Booking Id",
      field: "bookingId",
      sorting: false,
      align: "center",
    },
    {
      title: "Name",
      field: "indentorDetails.name",
      sorting: false,
      align: "center",
    },
    {
      title: "RollNo",
      field: "indentorDetails.roll",
      sorting: false,
      align: "center",
    },
    {
      title: "Phone",
      field: "indentorDetails.phone",
      sorting: false,
      align: "center",
    },
    { title: "Amount", field: "totalCost", align: "center", sorting: false },
    {
      title: "Details",
      field: "detail",
      align: "center",
      sorting: false,
      export: false,
      render: (rowData) =>
        rowData && (
          <IconButton onClick={() => modalHandler("handleClickOpen")}>
            <Button
              variant="contained"
              style={{
                padding: "0 5px",
                color:
                  rowData.status === "Rejected" || rowData.status === "Paid"
                    ? ""
                    : "white",
                background:
                  rowData.status === "Rejected" || rowData.status === "Paid"
                    ? "white"
                    : "#197CD2",
              }}
              disabled={
                rowData.status === "Rejected" || rowData.status === "Paid"
              }
            >
              Details
            </Button>
          </IconButton>
        ),
    },
    {
      title: "Action",
      field: "action",
      align: "center",
      sorting: false,
      export: false,
      render: (rowData) =>
        rowData && (
          <div style={{ display: "flex" }}>
            <IconButton
              onClick={() => {
                setOpen(false);
                setChildModal(false);
                setOpen(!open);
              }}
            >
              <Button
                variant="contained"
                style={{
                  padding: "0 5px",
                  color:
                    rowData.status === "Rejected" || rowData.status === "Paid"
                      ? ""
                      : "white",
                  background:
                    rowData.status === "Rejected" || rowData.status === "Paid"
                      ? "white"
                      : "#5cb85c",
                }}
                disabled={
                  rowData.status === "Rejected" || rowData.status === "Paid"
                }
              >
                {rowData.approvalLevel === "2"
                  ? "Payment 1"
                  : rowData.approvalLevel === "3"
                  ? "Payment 2"
                  : "Accept"}
              </Button>
            </IconButton>
            <IconButton onClick={() => modalHandler("rejectHandler2")}>
              <Button
                variant="contained"
                style={{
                  padding: "0 5px",
                  color:
                    rowData.status === "Rejected" || rowData.status === "Paid"
                      ? ""
                      : "white",
                  background:
                    rowData.status === "Rejected" || rowData.status === "Paid"
                      ? "white"
                      : "#d9534f",
                }}
                disabled={
                  rowData.status === "Rejected" || rowData.status === "Paid"
                }
              >
                Reject
              </Button>
            </IconButton>
          </div>
        ),
    },
  ];

  if (admin?.role === code_hall_office) {
    columns.push({
      title: "Status",
      field: "status",
      align: "center",
    });
  }

  return (
    <div className="home">
      <div className="container">
        <Heading />
        <div className="tab">
          <div>
            <Button
              onClick={() => router.push("/changePassword")}
              className="btns"
            >
              Change Password
            </Button>
          </div>
          <div>
            <Button onClick={logout} className="btns">
              Logout
            </Button>
          </div>
        </div>
        <div className="table">
          <MaterialTable
            onRowClick={(_, rowData) =>
              setModalData((prevData) => ({ ...prevData, ...rowData }))
            }
            columns={columns}
            data={tableData}
            title={"Guest Room Booking Details"}
            options={{
              search: true,
              searchFieldAlignment: "right",
              searchAutoFocus: true,
              searchFieldVariant: "standard",
              pageSizeOptions: [5, 10, 20, 50, 100],
              paginationType: "stepped",
              exportButton: true,
              exportAllData: true,
              exportFileName: "GuestRoomBookingDetails_Hall3",
              headerStyle: { fontWeight: "bold", color: "black" },
              rowStyle: (_, index) =>
                index % 2 === 0
                  ? { background: "#d7d7d7", fontWeight: "500" }
                  : { fontWeight: "500" },
            }}
          />
        </div>
        {!childModal && (
          <Modal
            open={open}
            onClose={() => modalHandler("handleClose")}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style }}>
              <h4 className="modal_heading">Room Details</h4>
              <div className="modal_content">
                <p>Room Number : {modalData?.roomDetails?.roomNo ?? ""}</p>
                <p>Room Type : {modalData?.roomDetails?.roomType ?? ""}</p>
                <p>Arrival Date : {modalData?.arrivalDate ?? ""}</p>
                <p>Departure Date : {modalData?.departureDate ?? ""}</p>
              </div>

              <hr style={{ width: "90%" }} />

              <h4 className="modal_heading">Visitor Details</h4>
              {modalData?.visitorDetails.map((_, indx) => {
                return (
                  <div className="modal_content" key={indx}>
                    <p>Name : {modalData?.visitorDetails[indx]?.name ?? ""}</p>
                    <p>
                      Mobile : {modalData?.visitorDetails[indx]?.phone ?? ""}
                    </p>
                    <p>
                      Relationship :{" "}
                      {modalData?.visitorDetails[indx]?.relationship ?? ""}
                    </p>
                  </div>
                );
              })}

              <div className="modal_content">
                Purpose of Visit: {modalData?.purposeOfVisit ?? ""}
              </div>

              <hr style={{ width: "90%" }} />

              <h4 className="modal_heading">Indentor Details</h4>
              <div className="modal_content">
                <p>Name : {modalData?.indentorDetails?.name ?? ""}</p>
                <p>Roll : {modalData?.indentorDetails?.roll ?? ""}</p>
                <p>Email : {modalData?.indentorDetails?.email ?? ""}</p>
                <p>Phone : {modalData?.indentorDetails?.phone ?? ""}</p>
              </div>

              <hr style={{ width: "90%" }} />

              <div
                style={{
                  margin: "10px auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton onClick={() => btnHandler("approval")}>
                  <Button
                    variant="contained"
                    style={{ padding: "0 5px", background: "#5cb85c",color: "white" }}
                    
                  >
                    {modalData.approvalLevel === "2"
                      ? "Payment 1"
                      : modalData.approvalLevel === "3"
                      ? "Payment 2"
                      : "Accept"}
                  </Button>
                </IconButton>
                <IconButton onClick={() => setChildModal(true)}>
                  <Button
                    variant="contained"
                    style={{ padding: "0 5px", background: "#d9534f", color:'white' }}
                    className="btns"
                  >
                    Reject
                  </Button>
                </IconButton>
              </div>
            </Box>
          </Modal>
        )}
        {childModal && (
          <Modal
            open={open}
            onClose={() => modalHandler("handleClose")}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style, height: "auto" }}>
              <h4 className="modal_heading">Any Reason for Rejection?</h4>
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": { margin: 2, width: "25ch" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  style={{ width: "100%" }}
                  label="Type Here...."
                  type="text"
                  value={reason ?? ""}
                  onChange={(ev) => setReason(ev.target.value)}
                  InputProps={{
                    readOnly: false,
                  }}
                />
              </Box>

              <>
                <IconButton onClick={() => btnHandler("rejection")}>
                  <Button
                    variant="contained"
                    style={{ padding: "0 5px", background: "#5cb85c", color:"white" }}
                    className="btns"
                  >
                    Confirm reject
                  </Button>
                </IconButton>
                <IconButton onClick={() => setChildModal(false)}>
                  <Button
                    variant="contained"
                    style={{ padding: "0 5px", background: "#d9534f", color:"white" }}
                    className="btns"
                  >
                    Close
                  </Button>
                </IconButton>
              </>
            </Box>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
