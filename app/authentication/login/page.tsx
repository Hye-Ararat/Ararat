import { Typography } from "../../../components/base";
import Image from "next/image"
import logo from "../../../public/logo.png"
import LoginForm from "./LoginForm";
import oidc from "../../../lib/oidc";
export default async function Login({searchParams }) {
    let interaction = searchParams.interaction;
    const inter= await oidc.Interaction.find(interaction);
    const client = await oidc.Client.find(inter?.params.client_id);
    return (
        <>
            <Image alt="Hye" src={logo} width={160} height={85.16} />
        <Typography>Please login to continue</Typography>
        <LoginForm interaction={interaction} />
        </>
    )
}