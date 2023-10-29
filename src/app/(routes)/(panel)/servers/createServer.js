"use client";

import { Button, Menu, rem } from "@mantine/core";
import {
  IconArrowBadgeDown,
  IconArrowDown,
  IconChevronDown,
} from "@tabler/icons-react";

export default function CreateServer() {
  return (
    <Menu
      transitionProps={{ transition: "pop" }}
      position="bottom-end"
      withinPortal
    >
      <Menu.Target>
        <Button
          my="auto"
          ml="auto"
          rightSection={
            <IconChevronDown
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          }
        >
          Create Server
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Server Type</Menu.Label>
        <Menu.Item>Physical Server</Menu.Item>
        <Menu.Item>Virtual Server</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
