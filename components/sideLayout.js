import { CheckBox } from "@mui/icons-material";
import { Divider, Grid, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import { useState } from "react";

export default function SideLayout({ listItems, thirdItemFormatter, FarAction, FarSection, sections }) {
    const mobile = useMediaQuery(useTheme().breakpoints.down("md"));
    const [selected, setSelected] = useState(0);
    return (
        <Stack spacing={2} direction={mobile ? "column" : "row"} divider={mobile ? "" : <Divider orientation="vertical" flexItem />}>
            <Grid container xs={12} sm={12} md={3}>
                <List dense sx={{ backgroundColor: "background.paper", width: "100%" }}>
                    {listItems.map((item, index) => {
                        return (
                            <ListItem key={index} selected={selected == index} disablePadding onClick={() => setSelected(index)} secondaryAction={<CheckBox sx={{ ml: "auto" }} />}>
                                <ListItemButton>
                                    <ListItemText primary={item.title} secondary={item.secondary} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Grid>
            <Grid container xs={12} sm={12} md={9} direction="column">
                <Divider sx={{ mb: 1.5 }} />
                <Grid container direction="row">
                    <Grid container direction="column" xs={7} sm={6.5} md={5}>
                        <Grid container direction="row">
                            {!mobile ?
                                <>
                                    <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>{listItems[selected].title}</Typography>
                                    <Typography fontWeight={400} variant="h6" color="text.secondary" sx={{ mt: "auto", mb: "auto", ml: .8 }}>{listItems[selected].secondary}</Typography>
                                </> : ""}
                        </Grid>
                        <Grid container direction="row" sx={{ mt: mobile ? "auto" : "", mb: mobile ? "auto" : "" }}>
                            <>
                                <Typography color="text.secondary" sx={{ mt: "auto", mb: "auto" }}>
                                    {thirdItemFormatter(listItems[selected].id)}
                                </Typography>
                            </>
                        </Grid>
                    </Grid>
                    {!mobile ?
                        <Grid container direction="row" md={3.5} sx={{ ml: "auto" }}>
                            <FarSection id={listItems[selected].id} />
                        </Grid>
                        : ""}
                    <Grid container direction="column" sx={{ ml: "auto" }} xs={2} sm={2} md={2}>
                        <FarAction id={listItems[selected].id} />
                    </Grid>

                </Grid>
                <Divider sx={{ mt: 2, mb: 2 }} />
                {sections.map((section, index) => {
                    return (
                        <>
                            <Grid container direction="row" sx={{ mb: 1, mt: index == 0 ? 0 : 2 }}>
                                <Typography variant="h6" key={index}>{section.title}</Typography>
                                {section.action ? section.action(listItems[selected].id) : ""}
                            </Grid>
                            <Paper sx={{ p: 2 }}>
                                {section.formatter(listItems[selected].id)}
                            </Paper>
                        </>

                    )
                })}

            </Grid>
        </Stack>
    )
};

export function reformatItemList(items, idKey, titleKey, secondaryKey, thirdKey) {
    return items.map((item, index) => {
        return {
            id: item[idKey],
            title: item[titleKey],
            secondary: item[secondaryKey],
            thirdKey: item[thirdKey]
        }
    })
}
