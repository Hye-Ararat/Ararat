"use client";
import { Avatar, Center, Grid, Group, Paper, Text, Stack, Button } from "@mantine/core"
import classes from "./datatable.module.css"
import { IconHeadset } from "@tabler/icons-react";
import React from "react";

const genRand = (len) => {
    return Math.random().toString(36).substring(2,len+2);
  }

/**
 * @param {React.PropsWithChildren<{}>} props 
 */
export function DataTable(props) {
    return (
        <div style={{ width: "100%" }}>
            {props.children}
        </div>
    )
}

/**
 * @param {React.PropsWithChildren<{
 *   columns: {
 *    name: string,
 *    value: string
 *   }[],
 *   icon: React.ReactNode
 * }>} props 
 */
export function DataTableRow(props) {
    return (
        <Paper className={classes.row} key={genRand(10)}>
            <Group>
                <Avatar>
                        {props.icon}
                </Avatar>
                <div className={classes.col}>
                    <Text mt={"auto"} mb={"auto"} fw={600}>Instance</Text>
                </div>
                <Group style={{ marginLeft: "auto", marginRight: "auto" }}>
                    {props.columns.map(col => {
                        return (
                            <div className={classes.col} style={{ marginLeft: "75px", marginRight: "75px" }}>
                                <Stack gap={0}>
                                    <Text fw={600}>{col.value}</Text>
                                    <Text fz={"xs"} style={{ color: "gray" }}>{col.name}</Text>
                                </Stack>
                            </div>
                        )
                    })}
                </Group>

                <div className={classes.col} style={{ marginLeft: "auto" }}>
                    <Button>Manage</Button>

                </div>
            </Group>
        </Paper>
    )
}