import prisma from "@/lib/prisma";
import { Title } from "@mantine/core";
import { User } from "@prisma/client";

export async function getServerSideProps() {
    let users = await prisma.user.findMany();
    return {
        props: {
            users: users
        }
    }
}


export default function Users({users}: {users: User[]}) {
    return (
        <>
        <Title order={1}>Users</Title>
        {users.map((user) => {
            return (
                <p>{user.firstName}</p>
            )
        })}
        </>

    )
}