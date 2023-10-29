import { getOrganization } from "@/app/_lib/organizations";
import { Flex, Text, Title } from "@mantine/core";
import OrganizationTabs from "./organizationTabs";

export default async function OrganizationLayout({
  children,
  params: { organizationId },
}) {
  let organization = await getOrganization(organizationId);
  return (
    <>
      <Flex>
        <Flex mr="xs">
          <img
            src={`${organization.logoUrl}`}
            style={{
              maxWidth: 100,
              marginTop: "auto",
              marginBottom: "auto",
              marginRight: "2px",
            }}
          />
        </Flex>
        <Flex direction="column">
          <Title order={1}>{organization.name}</Title>
          <Text size="lg" c="dimmed">
            Organization
          </Text>
        </Flex>
      </Flex>
      <OrganizationTabs />
      {children}
    </>
  );
}
