import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#D1EFF2",
    },
    secondary: {
      main: "#000000",
    },
    info: {
      main: "#ffffff",
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontSize: 14,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
        },
      },
    },
  },
});
