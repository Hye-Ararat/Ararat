import { DataTable, DataTableRow } from "@/app/_components/datatable";
import { Button, Flex, Title } from "@mantine/core";
import { IconHeadset } from "@tabler/icons-react";
import { validateSession } from "@/app/_lib/session";
import CreateInstance from "./CreateInstance";
export default async function Instances() {
  const session = await validateSession();
  return (
    <>
      <Flex>
        <Title order={1} my="auto">
          Instances
        </Title>
        <CreateInstance />
      </Flex>
      <Flex>
        <DataTable>
          <DataTableRow icon={<IconHeadset />} columns={[{
            name: "CPU",
            value: "10%"
          }, {
            name: "Memory",
            value: "1235MB"
          }]} />
          <DataTableRow icon={<IconHeadset />} columns={[{
            name: "CPU",
            value: "10%"
          }, {
            name: "Memory",
            value: "1235MB"
          }]} />
          <DataTableRow icon={<IconHeadset />} columns={[{
            name: "CPU",
            value: "10%"
          }, {
            name: "Memory",
            value: "1235MB"
          }]} />
          <DataTableRow icon={<IconHeadset />} columns={[{
            name: "CPU",
            value: "10%"
          }, {
            name: "Memory",
            value: "1235MB"
          }]} />
        </DataTable>
      </Flex>
    </>

  );
}
