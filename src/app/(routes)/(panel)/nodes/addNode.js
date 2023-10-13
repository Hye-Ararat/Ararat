"use client";

import Modal from "@/app/_components/modal";
import { Button, Text, Stepper, Divider, Flex, List, Group, Input, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CodeHighlight } from "@mantine/code-highlight";

export default function AddNode() {
  const [addingNode, setAddingNode] = useState(false);
  const [audio, setAudio] = useState();
  const [step1Audio, setStep1Audio] = useState();
  const [step, setStep] = useState(0);

  useEffect(() => {
    setAudio(new Audio("/audio/createNode.m4a"));
    setStep1Audio(new Audio("/audio/step1Node.m4a"));
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          audio.play();
          audio.loop = true;
          setAddingNode(true);
          setTimeout(() => {
            step1Audio.play();
          }, 500);
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
          step1Audio.pause();
        }}
        size="xl"
        title="Add Node"
        playSound={false}
      >
        <Stepper active={step}>
          <Stepper.Step label="Install Dependencies">
            <Text>
              Welcome, and thank you for choosing Hye Ararat as your
              infrastructure management solution. Let's get your shiny new node
              all setup and ready to go.
            </Text>
            <Text mt="xs">
              Follow the instructions in this wizard to install the required
              software for this Hye Ararat installation to manage your node
            </Text>
            <Text fw={"bold"} my="xs">
              System Requirements
            </Text>
            <List>
              <List.Item>{`Ubuntu LTS (22.04+)`}</List.Item>
              <List.Item>{`At least 1GB memory`}</List.Item>
              <List.Item>{`At least 5GB storage`}</List.Item>
            </List>
            <Text fw={"bold"} my="xs">
              Software Dependencies
            </Text>
            <List>
              <List.Item>
                {" "}
                <Link
                  style={{ color: "inherit" }}
                  href="http://bun.sh"
                  target="_blank"
                >
                  {`Bun`}{" "}
                </Link>
              </List.Item>
              <List.Item>
                <Link
                  style={{ color: "inherit" }}
                  href="https://git-scm.com"
                  target="_blank"
                >
                  {`Git`}{" "}
                </Link>
              </List.Item>
              <List.Item>
                <Link
                  style={{ color: "inherit" }}
                  href="https://ubuntu.com/lxd"
                  target="_blank"
                >
                  {`Incus`}{" "}
                </Link>
              </List.Item>
            </List>
            <Text mt="sm">
              If your node meets the system requirements, and you have installed
              the required software dependencies on your node, press "Next" to
              continue.
            </Text>
          </Stepper.Step>
          <Stepper.Step label="Install Hye Lava">
            <Text fw={"bold"} my="xs">Now we are ready to Install Hye Lava.</Text>
            <Text>Start out by cloning our repository. This will download Hye Lava</Text>
            <CodeHighlight code={"git clone \"https://github.com/Hye-Dev/Lava.git\""} withCopyButton={false} my={5} lang="sh" />
            <Text>Now navigate to the folder and install the modules</Text>
            <CodeHighlight code={"cd Lava\nnpm install"} withCopyButton={false} my={5} lang="sh" />
            <Text>Now create a .env file in this directory, in here you will put the config following our example</Text>
            <CodeHighlight code={"ARARAT_URL=\"https://ararat.example.com\""} withCopyButton={false} my={5} lang="env" />
            <Text>You can now try out running Hye Lava by running</Text>
            <CodeHighlight code={"npm start"} withCopyButton={false} my={5} lang="sh" />
            <Group gap={3}><Text fw={"bold"} my="xs">Optional:</Text><Text> Create a systemd file to run Lava in the background. Make sure to replace the placeholders with the appropriate values for your environment</Text></Group>

            <CodeHighlight code={`[Unit]
Description=Hye Lava
Documentation=https://github.com/Hye-Dev/Lava/tree/yergu
After=network-online.target

[Service]
User={lavaUser}
Restart=on-failure
WorkingDirectory={lavaDir}
ExecStart=/usr/bin/npm start

[Install]
WantedBy=multi-user.target`} withCopyButton={false} my={5} lang="ini" />
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Get full access">
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
        <Divider my="md" />
        <Flex>
          <Button
            ml="auto"
            mr="xs"
            color="red"
            onClick={() => {
              if (step == 0) {
                setAddingNode(false);
                audio.pause();
                audio.currentTime = 0;
                step1Audio.pause();
                step1Audio.currentTime = 0;
                return;
              }
              setStep(step - 1);
            }}
          >
            {step == 0 ? "Cancel" : "Back"}
          </Button>
          <Button
            onClick={() => {
              setStep(step + 1);
            }}
          >
            Next
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
