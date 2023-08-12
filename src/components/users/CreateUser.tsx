import { Button, Flex, Modal, TextInput, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function CreateUser({editingUser, userData, setEditingUser}: {editingUser: boolean, userData: any, setEditingUser: any}) {
    const [creatingUser, setCreatingUser] = useState(false);
    const [firstName, setFirstName] = useState(userData.firstName ? userData.firstName : "");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const theme = useMantineTheme();
    const router = useRouter();
    useEffect(() => {
        if (Object.keys(userData).length > 0) {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
        }
    }, [userData])
    return (
        <>
        <Button my="auto" onClick={() => {
            const audio = new Audio("/audio/popup.mp3");
            audio.play();
            setCreatingUser(true)
        }}>{"Create"} User</Button>
        <Modal centered opened={creatingUser || editingUser} onClose={() => {
            setCreatingUser(false)
            setEditingUser(false)
        }} overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} title={`${editingUser ? "Edit" : "Create"} User`}>
                <TextInput value={email} onChange={(e) => setEmail(e.target.value)} label="Email" placeholder="Email" withAsterisk />
                <TextInput value={firstName} onChange={(e) => setFirstName(e.target.value)} label="First Name" placeholder="First Name" withAsterisk />
                <TextInput value={lastName} onChange={(e) => setLastName(e.target.value)} label="Last Name" placeholder="Last Name" withAsterisk />
                <TextInput value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" label="Password" withAsterisk />
                <Flex>
                    <Button disabled={firstName.length == 0 || lastName.length == 0 || email.length == 0 || password.length == 0} ml="auto" mt="sm" color="green" variant="light"
                    onClick={async () => {
                        await fetch(`/api/users${editingUser ? `/${userData._id}` : ""}`, {
                            method: editingUser ? "PATCH": "POST",
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
                        setEditingUser(false);
                        router.push(router.asPath);
                    }}>{editingUser ? "Edit" : "Create"} User</Button>
                </Flex>
        </Modal>
        </>
    )
}