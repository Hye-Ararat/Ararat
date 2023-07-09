import { MainContext } from "@/components/AppShell";
import { DataTable, DataTableColumn, DataTableRow } from "@/components/DataTable";
import { CreateUser } from "@/components/users/CreateUser";
import { sanitizeMany } from "@/lib/db";
import mongo from "@/lib/mongo";
import { User } from "@/types/db";
import { ActionIcon, Badge, Button, Checkbox, Flex, Group, Table, Text, Title } from "@mantine/core";
import { IconServer2, IconTrash, IconUser, IconX } from "@tabler/icons-react";
import prettyBytes from "pretty-bytes";
import { createContext, use, useContext, useState } from "react";

const UsersContext = createContext({ setActiveUser: (user: string) => { }, activeUser: "", selectedUsers: ([] as { id: string, checked: boolean }[]), setSelectedUsers: (users: { id: string, checked: boolean }[]) => { } })

export async function getServerSideProps() {
    var usersCollection = await mongo.db().collection("User")
    let users = await ((await usersCollection.find({})).toArray())
    return {
        props: {
            users: sanitizeMany(users)
        }
    }
}

function UserAside({ user, closeAside }: { user: User, closeAside: () => void }) {
    return (
        <>
            <Text pb={"md"}>
                <Group>
                    <Text fw={700} fz="lg">
                        User Details
                    </Text>
                    <Flex align={"flex-end"} direction={"row"} ml={"auto"}>
                        <ActionIcon onClick={closeAside}>
                            <IconX />
                        </ActionIcon>
                    </Flex>
                </Group>
            </Text>
            <Table>
                <tbody>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Name
                            </Text>
                        </td>
                        <td>
                            {user.firstName} {user.lastName}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Email
                            </Text>
                        </td>
                        <td>
                            {user.email}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                First Name
                            </Text>
                        </td>
                        <td>
                            {user.firstName}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Text fw={650}>
                                Last Name
                            </Text>
                        </td>
                        <td>
                            {user.lastName}
                        </td>
                    </tr>
                </tbody>
            </Table>
        </>
    )
}

function UserTableRow({ user }: { user: User }) {
    const { setActiveUser, activeUser, selectedUsers, setSelectedUsers } = useContext(UsersContext)
    const { setAside, setAsideOpen, asideOpen } = useContext(MainContext)

    function setSelect(checked: boolean) {
        if (checked == false) {
            var i = selectedUsers.findIndex(s => s.id == user.email)
            var tmp = [...selectedUsers]
            tmp[i].checked = false
            setSelectedUsers(tmp)
        } else {
            var i = selectedUsers.findIndex(s => s.id == user.email)
            var tmp = [...selectedUsers]
            tmp[i].checked = true
            setSelectedUsers(tmp)
        }
    }
    function closeAside() {
        setAsideOpen(false);
        setAside("")
        setActiveUser("")
    }

    return (
        <DataTableRow active={activeUser == user.email} onClick={() => {
            setAsideOpen(true)
            setActiveUser(user.email)
            setAside(<UserAside user={user} closeAside={closeAside} />)
        }}>
            <DataTableColumn>
                <Group>
                    <Checkbox checked={selectedUsers.find(s => s.id == user.email)?.checked} onChange={(event) => {
                        setSelect(event.currentTarget.checked)
                    }} />
                    <IconUser size={40} />
                    <Text fz="md" fw={550}>
                        {user.firstName} {user.lastName}
                    </Text>
                </Group>
            </DataTableColumn>
            <DataTableColumn>
                <Text>
                    <div>
                        <Text fz="md" fw={550}>
                            {user.email}
                        </Text>
                        <Text c="dimmed" fz="xs">
                            Email
                        </Text>
                    </div>
                </Text>
            </DataTableColumn>
            <DataTableColumn>
                <Text>
                    <div>
                        <Text fz="md" fw={550}>
                            {user.firstName}
                        </Text>
                        <Text c="dimmed" fz="xs">
                            First Name
                        </Text>
                    </div>
                </Text>
            </DataTableColumn>
            <DataTableColumn>
                <Text>
                    <div>
                        <Text fz="md" fw={550}>
                            {user.lastName}
                        </Text>
                        <Text c="dimmed" fz="xs">
                            Last Name
                        </Text>
                    </div>
                </Text>
            </DataTableColumn>
            <DataTableColumn>
                <Group spacing={2} position="right">
                    <Button sx={{ mr: 40 }}>Edit</Button>
                </Group>
            </DataTableColumn>
        </DataTableRow>
    )
}

export default function Users({ users }: { users: User[] }) {
    var [activeUser, setActiveUser] = useState<string>("")
    var initialCheckedUsers = ([] as { id: string, checked: boolean }[])
    users.forEach(user => {
        initialCheckedUsers.push({ id: user.email, checked: false })
    })
    var [selectedUsers, setSelectedUsers] = useState<{ id: string, checked: boolean }[]>(initialCheckedUsers)
    return (
        <>
            <Flex>
                <Title order={1}>Users</Title>
                <div style={{ marginLeft: "auto" }}>
                    {selectedUsers.filter(s => s.checked == true).length > 0 ? <>
                        <Group>
                            <ActionIcon color="red" variant="light" size={"lg"}>
                                <IconTrash size={"1.2rem"} />
                            </ActionIcon>
                            <Button variant="light" onClick={() => {
                                setSelectedUsers(initialCheckedUsers)
                            }}>Cancel</Button>
                        </Group>
                    </> : ""}
                    {selectedUsers.filter(s => s.checked == true).length == 0 ? <>
                        <CreateUser />
                    </> : ""}
                </div>
            </Flex>
            <DataTable>
                <UsersContext.Provider value={{ activeUser, setActiveUser, selectedUsers, setSelectedUsers }}>
                    {users.map(user => {
                        return (
                            <UserTableRow user={user} />
                        )
                    })}
                </UsersContext.Provider>
            </DataTable>
        </>

    )
}