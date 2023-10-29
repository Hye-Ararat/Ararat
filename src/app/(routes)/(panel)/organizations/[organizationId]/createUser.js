"use client";

import Modal from "@/app/_components/modal";
import { createUser } from "@/app/_lib/users";
import { Button, Flex, TextInput } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUser({ organization }) {
  const router = useRouter();
  const [creatingUser, setCreatingUser] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  return (
    <>
      <Modal
        opened={creatingUser}
        title={`Create User in ${organization.name}`}
        onClose={() => setCreatingUser(false)}
      >
        <TextInput
          onChange={(e) => setEmail(e.currentTarget.value)}
          label="Name"
          placeholder="Joseph Maldjian"
        />
        <TextInput
          onChange={(e) => setName(e.currentTarget.value)}
          label="Email"
          placeholder="joseph@hyeararat.com"
          mt="xs"
        />
        <Flex mt="md">
          <Button
            ml="auto"
            onClick={async () => {
              await createUser(name, email, organization.id);
              setCreatingUser(false);
              router.refresh();
            }}
          >
            Create User
          </Button>
        </Flex>
      </Modal>
      <Button ml="auto" my="auto" onClick={() => setCreatingUser(true)}>
        Create User
      </Button>
    </>
  );
}
