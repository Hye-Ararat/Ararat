"use client";
import { Typography, Button, Grid, Dialog, DialogTitle, DialogContent, Divider, Stepper, Step, StepLabel, DialogActions, TextField, CircularProgress, Paper, Select, MenuItem, Menu, Input, InputLabel, InputAdornment, Checkbox, Grow, Zoom, Breadcrumbs, Backdrop, Container, FormControl, Box, List, ListItem, ListItemText, ListItemIcon, Tooltip, IconButton, Popover, Tabs, Tab, Stack, Accordion, AccordionActions, AccordionSummary, Skeleton, Fade, Switch, FormControlLabel, FormGroup, AccordionDetails, Alert, Snackbar, CssBaseline } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { LoadingButton } from "@mui/lab";
import { Circle } from "@mui/icons-material"
import theme from "./theme";

export  function Provider({children}: {children: any}) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

export { Typography, Button, Grid, Dialog, DialogTitle, DialogContent, Divider, Stepper, Step, StepLabel, DialogActions, TextField, CircularProgress, Paper, Select, MenuItem, Menu, Input, InputLabel, InputAdornment, Checkbox, Grow, Zoom, Breadcrumbs, Backdrop, Container, FormControl, Box, LoadingButton, List, ListItem, ListItemText, ListItemIcon, Circle, Tooltip, IconButton, Popover, Tabs, Tab, Stack, Accordion, AccordionActions, AccordionSummary, Skeleton, Fade, Switch, FormControlLabel, FormGroup, AccordionDetails, Alert, Snackbar }