import { Box } from "@mui/material";

const FormBox = ({ width = "110%", children, widthTop = "25ch" }) => {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: widthTop },
        "@media (max-width: 400px)": {
          "& .MuiTextField-root": {
            marginLeft: -2,
            marginRight: "auto",
            width: width,
          },
        },
      }}
      noValidate
      autoComplete="off"
    >
      {children}
    </Box>
  );
};

export default FormBox;
