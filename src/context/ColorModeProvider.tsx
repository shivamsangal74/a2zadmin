import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { ConfigProvider, theme as antTheme } from "antd";
import { ToastContainer } from "react-toastify";
import useColorMode from "../hooks/useColorMode";

type ColorMode = "light" | "dark";

type ColorModeContextValue = {
  colorMode: ColorMode;
  setColorMode: (value: ColorMode | ((prev: ColorMode) => ColorMode)) => void;
  isDark: boolean;
};

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export function useColorModeContext() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorModeContext must be used within ColorModeProvider");
  }
  return context;
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorMode] = useColorMode();
  const isDark = colorMode === "dark";

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
          primary: { main: "#3C50E0" },
          background: {
            default: isDark ? "#1A222C" : "#F1F5F9",
            paper: isDark ? "#24303F" : "#FFFFFF",
          },
          text: {
            primary: isDark ? "#DEE4EE" : "#1C2434",
            secondary: isDark ? "#AEB7C0" : "#64748B",
          },
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor: isDark ? "#1d2a39" : "#FFFFFF",
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: isDark ? "#AEB7C0" : undefined,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [isDark]
  );

  const antConfig = useMemo(
    () => ({
      algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      token: {
        colorPrimary: "#6d44e5",
        colorBgContainer: isDark ? "#24303F" : "#ffffff",
        colorBgElevated: isDark ? "#1d2a39" : "#ffffff",
        colorText: isDark ? "#DEE4EE" : "#1C2434",
        colorTextSecondary: isDark ? "#AEB7C0" : "#64748B",
        colorBorder: isDark ? "#3d4d60" : "#E2E8F0",
        colorSplit: isDark ? "#2E3A47" : "#E2E8F0",
      },
    }),
    [isDark]
  );

  const contextValue = useMemo(
    () => ({
      colorMode: colorMode as ColorMode,
      setColorMode,
      isDark,
    }),
    [colorMode, setColorMode, isDark]
  );

  return (
    <ColorModeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ConfigProvider theme={antConfig}>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={isDark ? "dark" : "light"}
          />
        </ConfigProvider>
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
