"use client";

import Modal from "@/app/_components/modal";
import { createOrganization } from "@/app/_lib/organizations";
import { Button, Flex, TextInput } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateOrganization() {
  const router = useRouter();
  const [creatingOrganization, setCreatingOrganization] = useState(false);
  const [organizationName, setOrganizationName] = useState(null);
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState(null);
  return (
    <>
      <Modal
        opened={creatingOrganization}
        onClose={() => setCreatingOrganization(false)}
        title="Create Organization"
      >
        <TextInput
          onChange={(e) => setOrganizationName(e.currentTarget.value)}
          label="Organization Name"
          placeholder="Hye Hosting LLC."
          mb="xs"
          required
        />
        <img src={`${organizationLogoUrl}`} height={40} />

        <TextInput
          onChange={(e) => setOrganizationLogoUrl(e.currentTarget.value)}
          label="Organization Logo URL"
          placeholder="https://www.hyeararat.com/img/logo-horizontal.png"
        />
        <Flex mt="md">
          <Button
            ml="auto"
            onClick={async () => {
              await createOrganization(organizationName, organizationLogoUrl);
              setCreatingOrganization(false);
              router.refresh();
            }}
          >
            Create Organization
          </Button>
        </Flex>
      </Modal>
      <Button my="auto" ml="auto" onClick={() => setCreatingOrganization(true)}>
        Create Organization
      </Button>
    </>
  );
}
