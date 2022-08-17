import { Button, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import Navigation from "../../components/navigation";
import PermissionsSelector from "../../components/permissionsSelector";
import SideLayout, { reformatItemList } from "../../components/sideLayout";
import prisma from "../../lib/prisma";



export async function getServerSideProps({ req, res, query }) {
    if (!req.cookies.access_token) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false
            }
        };
    }
    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
    let users = await prisma.user.findMany();
    let newUsers = [];
    users.forEach(user => {
        user.fullName = user.firstName + " " + user.lastName;
        newUsers.push(user);
    })
    return { props: { users: newUsers } }
}


export default function Users({ users }) {
    const [currentPermissions, currentPermissionsState] = useState([]);
    return (
        <>
            <Grid container direction="row" sx={{ mb: 2 }}>
                <Grid container xs={4}>
                    <Typography variant="h6" sx={{ mt: "auto", mb: "auto" }}>
                        Users
                    </Typography>
                </Grid>
                <Grid container xs={4} sm={4} md={3} sx={{ ml: "auto", mt: "auto", mb: "auto" }}>
                    <Button color="success" variant="contained" sx={{ ml: "auto" }} onClick={() => console.log("e")}>
                        Create User
                    </Button>
                </Grid>
            </Grid>
            <SideLayout listItems={reformatItemList(users, "id", "fullName", "email", "username")} thirdItemFormatter={() => { }} FarAction={(id) => {
                return (
                    <Button sx={{ ml: "auto", mt: "auto", mb: "auto" }} variant="contained" color="error">
                        Delete
                    </Button>
                )
            }
            } FarSection={({ id }) => {
                return (
                    <>
                    </>
                )
            }}
                sections={[{
                    title: "Permissions",
                    action: (item) => {
                        return (
                            <>
                            </>
                        )
                    },
                    formatter: (item => {
                        return (
                            <>
                                <Paper sx={{ backgroundColor: "#0d141d", p: 2 }}>
                                    <PermissionsSelector currentPermissions={currentPermissions} permissionsState={currentPermissionsState} permSection="global" currentPerms={[]} />
                                    <Grid container>
                                        <Button variant="contained" color="success" sx={{ mt: 2, ml: "auto" }}>Save Changes</Button>
                                    </Grid>
                                </Paper>

                            </>
                        )
                    })
                }]} />

        </>

    )
}


Users.getLayout = (page) => {
    return (
        <Navigation page="users">{page}</Navigation>
    );
};