import {createTheme} from "@mui/material/styles"
import { blue } from "@mui/material/colors";
import { Grow } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0d141d",
      paper: "#101924",
    },
    primary: {
      main: blue[500],
    },
    success: {
      main: "#163a3a",
      contrastText: "#1ee0ac"
    },
  /*   successNoContrast: {
      main: "#163a3a",
      contrastText: "#1ee0ac"
    }, */
    error: {
      main: "#34242b",
      contrastText: "#e85347",
    },
    info: {
      main: "#133542",
      contrastText: "#09c2de"
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
   /*  normal: {
      fontWeight: 600,
    }, */
  /*   normalNoBold: {
      fontWeight: 500,
    }, */
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
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(3px)",
          backgroundColor: "inherit"
        },
        invisible: {
          backdropFilter: "none"
        }
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12
        },
      /*   "&.Mui-selected": {
          backgroundColor: "#28374b",
          color: "#fff",
        } */
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#101924",
          backgroundImage: "linear-gradient(to bottom, #101924, #101924)",
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#28374b",
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#141c26",
          backgroundImage: "linear-gradient(to bottom, #141c26, #141c26)",
          borderRadius: 12,
        },
      },
      defaultProps: {
        transitionDuration: {
          appear: 0,
          enter: 600,
          exit: 300
        },
        TransitionComponent: Grow
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "borderRadius": 12,
          "marginRight": 10,
          "marginLeft": 10
        
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
    MuiList: {
      styleOverrides: {
        root: {
          "borderRadius": 12,
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: "10px",
          "&:before": {
            height: 0
          }
        },
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
        root: ({ ownerState }) => ({
          backgroundColor: "inherit",
          borderRadius: 6,
          ...(ownerState.variant == "standard" ? {
            input: {
              padding: 8,
              backdropFilter: "brightness(150%)",
              borderRadius: 12,
              border: "1px solid",
              borderColor: "rgba(200, 200, 200, 0.4)"
            }
          }
           : {})
           ,...(ownerState.variant == "outlined" ? {
            input: {
              padding: 8,
              borderRadius: 12,
              borderColor: "rgba(200, 200, 200, 0.4)"
            }
          }
          : {})
        }),
      },
      defaultProps: {
      InputProps: {
        disableUnderline: true
      }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          ":before": {
            borderBottom: 0,
          },
          ":hover:not(.Mui-disabled)::before": {
            borderBottom: 0,
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: "brightness(150%)"
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
          fontWeight: "600",
          borderRadius: 12
        },
        contained: {
          boxShadow: "none",
          "&:active": {
            boxShadow: "none",
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    }
  }
})
export default theme;