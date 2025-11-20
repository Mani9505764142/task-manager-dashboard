// frontend/src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },        // blue accent
    background: {
      default: "#0f1720",                // page background (dark)
      paper: "#101826",                  // card/panel background
    },
    text: {
      primary: "#e6eef8",
      secondary: "#9fb0c8",
    },
    success: { main: "#22c55e" },
    warning: { main: "#f59e0b" },
    error: { main: "#ef4444" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#0b4ea2",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#071428",
          color: "#e6eef8",
          borderRight: "1px solid rgba(255,255,255,0.04)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#0f1720",
          color: "#e6eef8",
          border: "1px solid rgba(255,255,255,0.04)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
        },
        containedPrimary: {
          background: "#1976d2",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,255,255,0.04)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          color: "#fff",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
