"use client";

import Modal from "@/app/_components/modal";
import {
  Button,
  Text,
  Stepper,
  Divider,
  Flex,
  List,
  Group,
  Input,
  TextInput,
  Fieldset,
  SimpleGrid,
  Autocomplete,
  Select,
  Textarea,
  Loader,
  Avatar,
} from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CodeHighlight } from "@mantine/code-highlight";
import { flag } from "country-emoji";
import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function AddNode({ locations }) {
  const [addingNode, setAddingNode] = useState(false);
  const [audio, setAudio] = useState();
  const [step1Audio, setStep1Audio] = useState();
  const [step, setStep] = useState(0);
  const [nodeName, setNodeName] = useState(null);
  const [locationGroup, setLocationGroup] = useState(null);
  const [nodeDescription, setNodeDescription] = useState(null);
  const [lavaUrl, setLavaUrl] = useState(null);
  const [successDone, setSuccessDone] = useState(false);
  const [ipmiUsername, setIpmiUsername] = useState(null);
  const [ipmiPassword, setIpmiPassword] = useState(null);
  const [ipmiIp, setIpmiIp] = useState(null);
  const [ipmiVersion, setIpmiVersion] = useState("2.0");
  const [serverBrand, setServerBrand] = useState("HP");
  const [boardSoftware, setBoardSoftware] = useState("iLO 4");
  const [snmpCommunity, setSnmpCommunity] = useState(null);
  const [snmpPort, setSnmpPort] = useState("161");
  const router = useRouter();
  let locationData = [];
  locations.forEach((location) => {
    let locationItems = [];
    location.locationGroups.forEach((group) => {
      locationItems.push({ label: group.name, value: group.id.toString() });
    });
    locationData.push({
      group: flag(location.countryCode) + " " + location.name,
      items: locationItems,
    });
  });
  useEffect(() => {
    setAudio(new Audio("/audio/createNode.m4a"));
    //setStep1Audio(new Audio("/audio/step1Node.m4a"));
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          audio.play();
          audio.loop = true;
          setAddingNode(true);
          setTimeout(() => {
            //step1Audio.play();
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
          //step1Audio.pause();
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
            <Text fw={"bold"} my="xs">
              Now we are ready to Install Hye Lava.
            </Text>
            <Text>
              Start out by cloning our repository. This will download Hye Lava
            </Text>
            <CodeHighlight
              code={'git clone "https://github.com/Hye-Dev/Lava.git"'}
              withCopyButton={false}
              my={5}
              lang="sh"
            />
            <Text>Now navigate to the folder and install the modules</Text>
            <CodeHighlight
              code={"cd Lava\nnpm install"}
              withCopyButton={false}
              my={5}
              lang="sh"
            />
            <Text>
              Now create a .env file in this directory, in here you will put the
              config following our example
            </Text>
            <CodeHighlight
              code={'ARARAT_URL="https://ararat.example.com"'}
              withCopyButton={false}
              my={5}
              lang="env"
            />
            <Text>You can now try out running Hye Lava by running</Text>
            <CodeHighlight
              code={"npm start"}
              withCopyButton={false}
              my={5}
              lang="sh"
            />
            <Group gap={3}>
              <Text fw={"bold"} my="xs">
                Optional:
              </Text>
              <Text>
                {" "}
                Create a systemd file to run Lava in the background. Make sure
                to replace the placeholders with the appropriate values for your
                environment
              </Text>
            </Group>

            <CodeHighlight
              code={`[Unit]
Description=Hye Lava
Documentation=https://github.com/Hye-Dev/Lava/tree/yergu
After=network-online.target

[Service]
User={lavaUser}
Restart=on-failure
WorkingDirectory={lavaDir}
ExecStart=/usr/bin/npm start

[Install]
WantedBy=multi-user.target`}
              withCopyButton={false}
              my={5}
              lang="ini"
            />
          </Stepper.Step>
          <Stepper.Step label="Node Information">
            <Fieldset legend="Identifying Information">
              <SimpleGrid cols={2}>
                <TextInput
                  onChange={(e) => setNodeName(e.target.value ?? null)}
                  label="Node Name"
                  value={nodeName}
                  placeholder="My Awesome Node"
                />
                <Select
                  data={locationData ?? []}
                  label="Location Group"
                  placeholder="Location Group"
                  onChange={(e) => {
                    setLocationGroup(e);
                  }}
                  value={locationGroup}
                />
              </SimpleGrid>
              <Textarea
                mt="xs"
                label="Description"
                placeholder="Node description"
                value={nodeDescription}
                onChange={(e) => setNodeDescription(e.currentTarget.value)}
              />
            </Fieldset>
            <Fieldset legend="Connectivity" mt="sm">
              <TextInput
                label="Hye Lava URL"
                placeholder="https://us-dal-1.hyeararat.com"
                onChange={(e) => setLavaUrl(e.currentTarget.value)}
              />
              <TextInput
                label="IPMI IP"
                mt="xs"
                placeholder="192.168.1.5"
                value={ipmiIp}
                onChange={(e) => setIpmiIp(e.currentTarget.value)}
              />
              <SimpleGrid cols={2} mt="xs">
                <TextInput
                  label="IPMI Username"
                  placeholder="root"
                  value={ipmiUsername}
                  onChange={(e) => setIpmiUsername(e.currentTarget.value)}
                />
                <TextInput
                  label="IPMI Password"
                  type="password"
                  placeholder="password"
                  value={ipmiPassword}
                  onChange={(e) => setIpmiPassword(e.currentTarget.value)}
                />
                <Select
                  value={ipmiVersion}
                  label="IPMI Version"
                  placeholder="IPMI Version"
                  data={["2.0"]}
                  onChange={(e) => setIpmiVersion(e)}
                />
                <TextInput
                  label="SNMP Community"
                  placeholder="public"
                  onChange={(e) => setSnmpCommunity(e.currentTarget.value)}
                  value={snmpCommunity}
                />
                <TextInput
                  label="SNMP Port"
                  value={snmpPort}
                  onChange={(e) => setSnmpPort(e.currentTarget.value)}
                />

                <Select
                  label="Server Brand"
                  placeholder="Server Brand"
                  data={["HP", "Dell"]}
                  value={serverBrand}
                  onChange={(e) => {
                    setBoardSoftware(null);
                    setServerBrand(e);
                  }}
                />
                <Select
                  label="Board Software"
                  placeholder="Board Software"
                  data={
                    serverBrand == "HP"
                      ? ["iLO 4"]
                      : serverBrand == "Dell"
                      ? ["iDRAC6"]
                      : ""
                  }
                  value={boardSoftware}
                  onChange={(e) => setBoardSoftware(e)}
                />
              </SimpleGrid>
            </Fieldset>
          </Stepper.Step>
          <Stepper.Completed>
            <Flex direction="column">
              {!successDone ? (
                <>
                  <Loader mx="auto" />
                  <Text fw="bold" fz={"lg"} mx="auto" mt="xs">
                    Adding Node...
                  </Text>
                </>
              ) : (
                <>
                  <Avatar size="lg" mx="auto" color="green">
                    <IconCheck />
                  </Avatar>
                  <Text fw="bold" fz={"lg"} mx="auto" mt="xs">
                    Node Added!
                  </Text>
                </>
              )}
            </Flex>
          </Stepper.Completed>
        </Stepper>
        <Divider my="md" />
        <Flex>
          <Button
            ml="auto"
            mr="xs"
            color="red"
            disabled={step == 3}
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
            onClick={async () => {
              setStep(step + 1);
              if (step == 2) {
                try {
                  await fetch("/api/nodes", {
                    method: "POST",
                    body: JSON.stringify({
                      name: nodeName,
                      description: nodeDescription ?? undefined,
                      locationGroup: parseInt(locationGroup),
                      lavaUrl: lavaUrl ?? undefined,
                      ipmiIp: ipmiIp ?? undefined,
                      ipmiUsername: ipmiUsername ?? undefined,
                      ipmiPassword: ipmiPassword ?? undefined,
                      ipmiVersion: ipmiVersion ?? undefined,
                      brand: serverBrand ?? undefined,
                      software: boardSoftware ?? undefined,
                      snmpCommunity: snmpCommunity ?? undefined,
                      snmpPort: snmpPort
                        ? snmpPort != "161"
                          ? parseInt(snmpPort)
                          : undefined
                        : undefined,
                    }),
                  });
                } catch (error) {}
                setSuccessDone(true);
                setTimeout(() => {
                  router.refresh();
                }, 1500);
              }
            }}
            disabled={step == 3}
            color={step != 2 ? undefined : "green"}
          >
            {step != 2 ? "Next" : "Finish"}
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
