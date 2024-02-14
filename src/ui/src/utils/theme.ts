import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
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
