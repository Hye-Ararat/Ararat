import { getProviders, signIn, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../api/auth/[...nextauth]/route";
import { redirect, useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";
import { BackgroundImage } from "@mantine/core";
import { validateSession } from "@/app/_lib/session";

export default async function SignIn() {
    var session = await validateSession(false)
    if (session) return redirect('/');
    const providers = JSON.parse(JSON.stringify(authOptions.providers)).map((p) => {
        return {
            id: p.id,
            name: p.name
        };
    })
    const random = Math.floor(Math.random() * 10) + 1;
    return (
        <BackgroundImage src={`/images/login/login${random}.jpg`} style={{width: "100%", height: "100%"}}>
            <LoginForm providers={providers} />
        </BackgroundImage>

    );
}