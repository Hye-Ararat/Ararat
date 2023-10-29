import { Avatar, Flex, Grid, TextInput, Title } from "@mantine/core";
import CreateUser from "./createUser";
import { getOrganization, getUsers } from "@/app/_lib/organizations";
import AccordionTable from "@/app/_components/accordionTable";
import { getPermissions } from "@/app/_lib/permissions";
import { IconQuestionMark } from "@tabler/icons-react";
import User from "./user";

export default async function Users({ params: { organizationId } }) {
  let permissions = await getPermissions("organization", organizationId);
  let organization = await getOrganization(organizationId);
  let users = await getUsers(organizationId);
  let rows = users.map((user) => {
    return {
      id: user.id,
      columns: [
        {
          primary: user.name,
          secondary: user.email,
        },
      ],
      panel: <User user={user} permissions={permissions} />,
    };
  });
  return (
    <>
      <Flex mb="sm">
        <Title my="auto" order={2}>
          Users
        </Title>
        {permissions.includes("create:user") ? (
          <CreateUser organization={organization} />
        ) : null}
      </Flex>
      {users.length > 0 ? (
        <AccordionTable rows={rows} />
      ) : (
        <>
          <Avatar size="lg" radius="xl" mx="auto" mb="xs">
            <IconQuestionMark size="2rem" />
          </Avatar>
          <Title order={3} align="center">
            No Users Found
          </Title>
        </>
      )}
    </>
  );
}
