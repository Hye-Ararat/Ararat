"use client";

import { Accordion, Flex, SimpleGrid, Text, Divider } from "@mantine/core";

export default function AccordionTable({ rows }) {
  return (
    <Accordion variant="separated">
      {rows.map((row) => {
        return <Row key={row.id} row={row} />;
      })}
    </Accordion>
  );
}

function Row({ row }) {
  return (
    <Accordion.Item value={row.id} key={row.id}>
      <Accordion.Control>
        <SimpleGrid columns={row.columns.length} w={"100%"}>
          {row.columns.map((column) => {
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
      </Accordion.Control>
      <Accordion.Panel>
        <Divider mb="sm" />
        {row.panel}
        </Accordion.Panel>
    </Accordion.Item>
  );
}
