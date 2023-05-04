import { Grid, Typography } from "../../../components/base";
import logo from "../../../public/logo.png"
import AuthorizeActions from "./AuthorizeActions";
import ScopesList from "./ScopesList";

export const revalidate = 0;

export default async function Login({searchParams }) {
    let interaction = searchParams.interaction;
    const inter = await fetch(`http://localhost:3003/interaction/${interaction}`).then(res => res.json())
    console.log(inter)
    //const inter= await oidc.Interaction.find(interaction);
    const client = await fetch(`http://localhost:3003/client/${inter?.params.client_id}`).then(res => res.json());
    console.log(client)
    console.log(inter)

    let scopes = client.scope.split(" ");
    console.log(inter?.params.scope)
    let activeScopes = inter.params.scope.split(" ");
    return (
        <>
            <img width={80} src={`${client?.logoUri}`} />
            <Typography fontWeight={500} sx={{mt: 2, mb: 0.5}}>Welcome back, {inter?.session.accountId}</Typography>
<Grid container direction="row" sx={{mb: 2}}>
        <Typography variant="h5" sx={{ml: "auto", mr: 0.25}} fontWeight={600}>{client?.clientName}</Typography>
        <Typography variant="h5" sx={{mr: "auto", ml: 0.25}} fontWeight={500}>{"wants to"}</Typography>
        </Grid>
        <ScopesList activeScopes={activeScopes} scopes={scopes} />
        <AuthorizeActions interaction={interaction} />
        </>
    )
}