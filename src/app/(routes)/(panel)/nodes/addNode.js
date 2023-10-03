"use client";

import Modal from "@/app/_components/modal";
import { Button, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export default function AddNode() {
  const [addingNode, setAddingNode] = useState(false);
  const [audio, setAudio] = useState();
  useEffect(() => {
    setAudio(new Audio("/audio/createNode.m4a"));
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          audio.play();
          audio.loop = true;
          setAddingNode(true);
        }}
        ml="auto"
        my="auto"
      >
        Add Node
      </Button>
      <Modal
        opened={addingNode}
        onClose={() => {
          setAddingNode(false);
          audio.pause();
          audio.currentTime = 0;
        }}
        size="xl"
        title="Add Node"
      >
        <Text>To be added</Text>
      </Modal>
    </>
  );
}
