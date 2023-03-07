import { Grid, Typography } from "../../../components/base";
import logo from "../../../public/logo.png"
import oidc from "../../../lib/oidc";
import AuthorizeActions from "./AuthorizeActions";
import ScopesList from "./ScopesList";

export default async function Login({searchParams }) {
    let interaction = searchParams.interaction;
    const inter= await oidc.Interaction.find(interaction);
    const client = await oidc.Client.find(inter?.params.client_id);
    console.log(client)
    console.log(inter)

    let scopes = client.scope.split(" ");
    console.log(inter?.params.scope)
    let activeScopes = inter.params.scope.split(" ");
    return (
        <>
            <img width={80} src={`${client?.logoUri}`} />
            <Typography fontWeight={500} sx={{mt: 2, mb: 0.5}}>Welcome back, {inter?.result.login.accountId}</Typography>
<Grid container direction="row" sx={{mb: 2}}>
        <Typography variant="h5" sx={{ml: "auto", mr: 0.25}} fontWeight={600}>{client?.clientName}</Typography>
        <Typography variant="h5" sx={{mr: "auto", ml: 0.25}} fontWeight={500}>{"wants to"}</Typography>
        </Grid>
        <ScopesList activeScopes={activeScopes} scopes={scopes} />
        <AuthorizeActions />
        </>
    )
}