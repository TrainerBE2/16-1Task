import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import shadows, { Shadows } from "@mui/material/styles/shadows";
import CssBaseline from "@mui/material/CssBaseline";

interface IThemeDefaultComponentProps {
    children: React.ReactNode;
}

const font = "'Open Sans', sans-serif";

const ThemeDefaultComponent = ({ children }: IThemeDefaultComponentProps) => {
    const loginTheme = createTheme({
        palette: {
            // mode: "dark",
            primary: {
                main: "#252525",
                contrastText: "#fff",
            },
            secondary: {
                main: "#2f2f2f",
            },
            error: {
                main: "#ED4521",
            },
            bolddanger: {
                main: "#E52828",
            },
            greyc4: {
                main: "#C4C4C4",
                contrastText: "#fff",
            },
            lightblue: {
                main: "#1976D2",
            },
            buttonblue: {
                main: "#0A5BBB",
                contrastText: "#fff",
            },
            buttonyellow: {
                main: "#E4D318",
                contrastText: "#fff",
            },
            buttonred: {
                main: "#FF7373",
                contrastText: "#fff",
            },
            buttongreen: {
                main: "#119C5B",
                contrastText: "#fff",
            },
            lightwarning: {
                main: "#ED6C02",
                contrastText: "#fff",
            },
            lighterror: {
                main: "#D32F2F",
                contrastText: "#fff",
            },
        },
        typography: {
            fontFamily: font,
            fontWeightMedium: 500,
            fontWeightBold: 700,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: "#fff",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        boxShadow: shadows.map(() => "none") as Shadows,
                    },
                },
            },
        },
    });
    return (
        <ThemeProvider theme={loginTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default ThemeDefaultComponent;
