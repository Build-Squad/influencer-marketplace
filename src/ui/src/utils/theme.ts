import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#26a7de",
    },
    secondary: {
      main: "#000000",
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontSize: 14,
    },
  },
});