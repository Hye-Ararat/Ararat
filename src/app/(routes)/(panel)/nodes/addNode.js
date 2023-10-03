"use client";

import Modal from "@/app/_components/modal";
import { Button, Text } from "@mantine/core";
import { useState } from "react";

export default function AddNode() {
  const [addingNode, setAddingNode] = useState(false);
  return (
    <>
      <Button onClick={() => setAddingNode(true)} ml="auto" my="auto">
        Add Node
      </Button>
      <Modal
        opened={addingNode}
        onClose={() => setAddingNode(false)}
        size="xl"
        title="Add Node"
      >
        <Text>To be added</Text>
      </Modal>
    </>
  );
}
