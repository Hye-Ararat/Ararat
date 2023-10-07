"use client";

import Modal from "@/app/_components/modal";
import { Button, Text, Stepper, Divider, Flex, List } from "@mantine/core";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AddNode() {
  const [addingNode, setAddingNode] = useState(false);
  const [audio, setAudio] = useState();
  const [step, setStep] = useState(0)
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
        playSound={false}
      >
        <Stepper active={step}>
        <Stepper.Step label="Install Dependencies">
          <Text>Welcome, and thank you for choosing Hye Ararat as your infrastructure management solution. Let's get your shiny new node all setup and ready to go.</Text>
          <Text mt="xs">Follow the instructions in this wizard to install the required software for this Hye Ararat installation to manage your node</Text>
          <Text fw={"bold"} my="xs">System Requirements</Text>
          <List>
            <List.Item>{`Ubuntu LTS (22.04+)`}</List.Item>
            <List.Item>{`At least 1GB memory`}</List.Item>
            <List.Item>{`At least 5GB storage`}</List.Item>
          </List>
          <Text fw={"bold"} my="xs">Software Dependencies</Text>
          <List>
            <List.Item>            <Link style={{ color: "inherit"}} href="http://bun.sh" target="_blank">
{`Bun`}            </Link>
</List.Item>
            <List.Item><Link style={{ color: "inherit"}} href="https://git-scm.com" target="_blank">
{`Git`}            </Link></List.Item>
            <List.Item><Link style={{ color: "inherit"}} href="https://ubuntu.com/lxd" target="_blank">
{`LXD`}            </Link></List.Item>
          </List>
          <Text mt="sm">If your node meets the system requirements, and you have installed the required software dependencies on your node, press "Next" to continue.</Text>
          </Stepper.Step>
          <Stepper.Step label="Install Hye Lava" >
            </Stepper.Step>
            <Stepper.Step
          label="Final step"
          description="Get full access"
        >
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
          </Stepper>
          <Divider my="md" />
          <Flex>
            <Button ml="auto" mr="xs" color="red" onClick={() => {
              if (step == 0) {
                setAddingNode(false)
                audio.pause();
                audio.currentTime = 0;
                return;
              }
              setStep(step - 1);
            }}>{step == 0 ? "Cancel" : "Back"}</Button>
            <Button onClick={() => {
              setStep(step + 1)
            }}>Next</Button>
          </Flex>
        
      </Modal>
    </>
  );
}
