import React from "react";
import { Box, Button } from "@mui/material";

const FormButton = ({ onClick, children, disabled }) => {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 2, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <Button
        variant="outlined"
        className="btns"
        onClick={onClick}
        disabled={disabled === undefined ? undefined : disabled}
      >
        {children}
      </Button>
    </Box>
  );
};

export default FormButton;
