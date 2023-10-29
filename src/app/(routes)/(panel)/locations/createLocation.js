"use client";

import Modal from "@/app/_components/modal";
import { Button, Flex, Loader, Select, TextInput } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLocation } from "@/app/_lib/locations";
import { countryCodeEmoji } from 'country-code-emoji';
import { countries } from "@/app/_lib/countries";

export default function CreateLocation() {
    const router = useRouter();
    const [creatingLocation, setCreatingLocation] = useState(false);
    const [locationName, setLocationName] = useState(null);
    const [locationCountry, setLocationCountry] = useState(null);
    return (
        <>
            <Modal
                opened={creatingLocation}
                onClose={() => setCreatingLocation(false)}
                title="Create Location"
            >
                <TextInput
                    onChange={(e) => setLocationName(e.currentTarget.value)}
                    label="Location Name"
                    placeholder="us-dal"
                    mb="xs"
                    required
                />
                <Select searchable label="Country" data={Object.keys(countries).map((code) => {
                    return {
                        "value": code,
                        "label": countryCodeEmoji(code) + " " + countries[code]
                    }
                })} filter={(opt) => {
                    return opt.options.filter((o) => {
                        if (!opt) return true;
                        return o.label.toLowerCase().includes(opt.search.toLowerCase()) || o.value.toLowerCase().includes(opt.search.toLowerCase())
                    })
                }} onChange={(value) => {
                    setLocationCountry(value)
                }}/>
                <Flex mt="md">
                    <Button
                        ml="auto"
                        onClick={async () => {
                            await createLocation(locationName, locationCountry);
                            setCreatingLocation(false);
                            router.refresh();
                        }}
                    >
                        Create Location
                    </Button>
                </Flex>
            </Modal>
            <Button my="auto" ml="auto" onClick={() => {
                setCreatingLocation(true)
            }}>
                Create Location
            </Button>
        </>
    );
}
