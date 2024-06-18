import { Box } from "@mui/material";

const FormBox2 = ({children}) => {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { margin: 2, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      {children}
    </Box>
  );
};

export default FormBox2;
