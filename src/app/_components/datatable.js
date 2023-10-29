"use client";
import {
  Avatar,
  Center,
  Grid,
  Group,
  Paper,
  Text,
  Stack,
  Button,
  Flex,
  Box,
  SimpleGrid,
} from "@mantine/core";
import classes from "./datatable.module.css";
import { IconHeadset } from "@tabler/icons-react";
import React from "react";
import Link from "next/link";

const genRand = (len) => {
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
};

/**
 * @param {React.PropsWithChildren<{}>} props
 */
export function DataTable(props) {
  return <div style={{ width: "100%" }}>{props.children}</div>;
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
export function DataTableRow({ columns, icon, button }) {
  return (
    <>
      <Paper className={classes.row} p="md" radius="lg" mb="xs">
        <Flex>
          {icon}

          <SimpleGrid cols={columns.length} w={"100%"}>
            {columns.map((column, i) => {
              return (
                <Flex direction="column" my="auto" ml="sm">
                  <Text fz="md" fw={550}>
                    {column.primary}
                  </Text>
                  <Text c="dimmed" fz="xs">
                    {column.secondary}
                  </Text>
                </Flex>
              );
            })}
          </SimpleGrid>
          {button ? (
            <Link
              href={button.link}
              style={{
                marginLeft: "auto",
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              <Button ml="auto" my="auto">
                {button.text}
              </Button>
            </Link>
          ) : (
            ""
          )}
        </Flex>
      </Paper>
    </>
  );
}
