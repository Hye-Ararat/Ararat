"use client";

import Modal from "@/app/_components/modal";
import { createRack } from "@/app/_lib/racks";
import { Button, Flex, Loader, Select, TextInput } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getLocations } from "@/app/_lib/locations";
import { countryCodeEmoji } from 'country-code-emoji';

export default function CreateRack({locations}) {
    const router = useRouter();
    const [error, setError] = useState(null)
    const [creatingRack, setCreatingRack] = useState(false);
    const [rackName, setRackName] = useState(null);
    const [rackDescription, setRackDescription] = useState(null);
    const [rackLocation, setRackLocation] = useState(null);
    return (
        <>
            <Modal
                opened={creatingRack}
                onClose={() => setCreatingRack(false)}
                title="Create Rack"
            >
                <TextInput
                    onChange={(e) => setRackName(e.currentTarget.value)}
                    label="Rack Name"
                    placeholder="Rack-01"
                    mb="xs"
                    required
                />
                <TextInput
                    onChange={(e) => setRackDescription(e.currentTarget.value)}
                    label="Rack Description"
                    placeholder="Description"
                    mb="xs"
                />
                <Select data={locations.map(location => {
                    return {
                        "value": location.id,
                        "label": countryCodeEmoji(location.countryCode) + " " + location.name
                    }
                })} label="Location" placeholder="Location" searchable onChange={(e) => {
                    setRackLocation(e)
                }} />
                <Flex mt="md">

                    <Button
                        ml="auto"
                        onClick={async () => {
                            await createRack(rackName, rackDescription, rackLocation);
                            setCreatingRack(false);
                            router.refresh();
                        }}
                    >
                        Create Rack
                    </Button>
                </Flex>
            </Modal>
            <Button my="auto" ml="auto" onClick={() => {
                setCreatingRack(true)
            }}>
                Create Rack
            </Button>
        </>
    );
}
