import { Button, Flex, Modal, TextInput, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";

export function CreateUser() {
    const [creatingUser, setCreatingUser] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const theme = useMantineTheme();
    const router = useRouter();
    return (
        <>
        <Button my="auto" onClick={() => {
            const audio = new Audio("/audio/popup.mp3");
            audio.play();
            setCreatingUser(true)
        }}>Create User</Button>
        <Modal centered opened={creatingUser} onClose={() => setCreatingUser(false)} overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} title="Create User">
                <TextInput onChange={(e) => setEmail(e.target.value)} label="Email" placeholder="Email" withAsterisk />
                <TextInput onChange={(e) => setFirstName(e.target.value)} label="First Name" placeholder="First Name" withAsterisk />
                <TextInput onChange={(e) => setLastName(e.target.value)} label="Last Name" placeholder="Last Name" withAsterisk />
                <TextInput onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" label="Password" withAsterisk />
                <Flex>
                    <Button disabled={firstName.length == 0 || lastName.length == 0 || email.length == 0 || password.length == 0} ml="auto" mt="sm" color="green" variant="light"
                    onClick={async () => {
                        await fetch("/api/users", {
                            method: "POST",
                            body: JSON.stringify({
                                email: email,
                                firstName: firstName,
                                lastName: lastName,
                                password: password,
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                        setCreatingUser(false);
                        router.push(router.asPath);
                    }}>Create User</Button>
                </Flex>
        </Modal>
        </>
    )
}