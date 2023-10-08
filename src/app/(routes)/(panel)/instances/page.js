import { DataTable, DataTableRow } from "@/app/_components/datatable";
import { Avatar, Button, Flex, Text, Title } from "@mantine/core";
import { IconHeadset, IconQuestionMark } from "@tabler/icons-react";
import { validateSession } from "@/app/_lib/session";
import CreateInstance from "./CreateInstance";
import { getRoles } from "@/app/_lib/roles";
export default async function Instances() {
  const session = await validateSession();
  let roles = await getRoles(session.user.id);
  let hasInstances = JSON.stringify(roles).includes("instance");
  let canCreate =
    roles.global.includes("node-operator") ||
    roles.global.includes("node-user") ||
    roles.node.includes("node-operator") ||
    roles.node.includes("node-user");
  return (
    <>
      <Flex>
        <Title order={1} my="auto">
          Instances
        </Title>
        {canCreate ? <CreateInstance /> : ""}
      </Flex>
      <Flex>
        {hasInstances ? (
          <DataTable>
            <DataTableRow
              icon={<IconHeadset />}
              columns={[
                {
                  name: "CPU",
                  value: "10%",
                },
                {
                  name: "Memory",
                  value: "1235MB",
                },
              ]}
            />
            <DataTableRow
              icon={<IconHeadset />}
              columns={[
                {
                  name: "CPU",
                  value: "10%",
                },
                {
                  name: "Memory",
                  value: "1235MB",
                },
              ]}
            />
            <DataTableRow
              icon={<IconHeadset />}
              columns={[
                {
                  name: "CPU",
                  value: "10%",
                },
                {
                  name: "Memory",
                  value: "1235MB",
                },
              ]}
            />
            <DataTableRow
              icon={<IconHeadset />}
              columns={[
                {
                  name: "CPU",
                  value: "10%",
                },
                {
                  name: "Memory",
                  value: "1235MB",
                },
              ]}
            />
          </DataTable>
        ) : (
          <Flex direction="column" mx="auto">
            <Avatar size="80px" mx="auto">
              <IconQuestionMark size={50} mx="auto" my="auto" />
            </Avatar>
            <Title mx="auto" order={2}>
              No Instances Found
            </Title>
            <Text mx="auto" fw={600}>
              Try creating one
            </Text>
          </Flex>
        )}
      </Flex>
    </>
  );
}
