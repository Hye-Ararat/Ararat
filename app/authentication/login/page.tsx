import { Typography } from "../../../components/base";
import Image from "next/image"
import logo from "../../../public/logo.png"
import LoginForm from "./LoginForm";
import {client as oidcClient} from "../../../lib/oidcClient";
import Redirect from "./Redirect";

export default async function Login({searchParams }) {
    let interaction = searchParams.interaction;
    let url;
    if (!interaction) {
        let client = await oidcClient();
        url = client.authorizationUrl("openid profile");
    }
    return (
        <>
        <Image alt="Hye" src={logo} width={160} height={85.16} />
        {interaction ? 
        <>
        <Typography>Please login to continue</Typography>
        <LoginForm interaction={interaction} />
        </>
        :
        <Redirect interaction={interaction} url={url} />
}
        </>
    )
}