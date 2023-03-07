"use client";

import { Check, Close } from "@mui/icons-material";
import { Grid, Typography, List, ListItem, ListItemText, Paper, ListItemIcon } from "../../../components/base";

export default function ScopesList({scopes, activeScopes}) {
    let index = scopes.indexOf("openid");
    scopes = scopes.filter((scope) => !activeScopes.includes(scope))
    let englishScopes = scopes.map((scope) => {
        if (scope === "profile") return {description: "View basic profile information", active: false};
        if (scope === "email") return {description: "View your email address", active: false};
        if (scope == "openid") return {description: "Authenticate with your account", active: true};
    })
    let activeEnglishScopes = activeScopes.map((scope) => {
        if (scope === "profile") return {description: "View basic profile information", active: true};
        if (scope === "email") return {description: "View your email address", active: true};
        if (scope == "openid") return {description: "Authenticate with your account", active: true};
    })
    let allScopes = englishScopes.concat(activeEnglishScopes);
    allScopes.sort((a, b) => {
        if (a.active && !b.active) return -1;
        if (!a.active && b.active) return 1;
        return 0;
    })
    console.log(allScopes)
    return (
        <>
        <Paper>
        <List>
        {allScopes.map((scope) => {
            return (
            <ListItem>
                <ListItemIcon>
                    {scope.active ? <Check sx={{color: "#1ee0ac"}} /> : <Close sx={{color: "#e85347"}} />}
                    </ListItemIcon>
            <ListItemText>{scope.description}</ListItemText>
            </ListItem>
            )
        })
        }
        </List>
        </Paper>
        </>
    )
}