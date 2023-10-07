"use client";
import { Button, Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import Modal from "@/app/_components/modal";
export default function CreateInstance() {
  const [audio, setAudio] = useState(null);
  const [addingInstance, setAddingInstance] = useState(false);
  useEffect(() => {
    setAudio(new Audio("/audio/createInstance.m4a"));
  }, []);
  return (
    <>
      <Button my="auto" ml="auto" onClick={() => {
        audio.loop = true;
        audio.play();
        setAddingInstance(true);
      }}>Create Instance</Button>
      <Modal opened={addingInstance} onClose={() => {
        setAddingInstance(false);
        audio.pause();
        audio.currentTime = 0;
      }}
        size="xl"
        title="Create Instance"
        playSound={false}>
        <Tabs>
          <Tabs.List>
            <Tabs.Tab value="details">Details</Tabs.Tab>
          </Tabs.List>
        </Tabs>

      </Modal>
    </>
  )
}