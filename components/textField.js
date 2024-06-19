import React from "react";
import { Box, TextField } from "@mui/material";

const FormField = ({
  label,
  type,
  name,
  value,
  onChange,
  m,
  marginBottom,
  width,
  disabled
}) => {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": {
          m: m === undefined ? undefined : m,
          width: width === undefined ? undefined : width,
          marginBottom: marginBottom === undefined ? undefined : marginBottom,
        },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label={label}
        type={type}
        name={name}
        disabled= {disabled === undefined ? undefined : disabled}
        value={value}
        onChange={onChange}
        InputProps={{
          readOnly: false,
        }}
      />
    </Box>
  );
};

export default FormField;
