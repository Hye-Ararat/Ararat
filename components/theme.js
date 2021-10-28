import { createTheme } from "@mui/material";
import { blue } from "@mui/material/colors";

const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#0d141d",
            paper: "#141c26",
        },
        primary: {
            main: blue[500],
        },
        success: {
            main: "#163a3a",
            contrastText: "#1ee0ac"
        },
        successNoContrast: {
            main: "#163a3a",
            contrastText: "#1ee0ac"
        },
        error: {
            main: "#34242b",
            contrastText: "#e85347"
        },
        info: {
            main: "#1ee0ac",
            contrastText: "#e83547"
        },
        warning: {
            main: "#363422",
            contrastText: "#f4bd0e"
        },
    },
    typography: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        body2: {
            fontWeight: 500,
        },
        normal: {
            fontWeight: 600,
        },
        normalNoBold: {
            fontWeight: 500,
        },
        h4: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper : {
                    backgroundColor: "#101924",
                }
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: "#23874b",
                }
            }
        },
        MuiListSubheader: {
            styleOverrides: {
                root: {
                    backgroundColor: "#101924",
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontWeight: 500
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: "#28374b",
                    borderRadius: 6,
                }
            }
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    borderRadius: 6
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 6
                },
                notchedOutline: {
                    borderRadius: 6,
                    borderStyle: "none",
                    overflow: "hidden"
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: "#101924",
                    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: "600"
                },
                contained: {
                    boxShadow: "none",
                    "&:active": {
                        boxShadow: "none",
                    }
                }
            }
        }
    }
})
export default theme;