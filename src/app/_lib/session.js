import { getServerSession } from "next-auth";
import { authOptions } from "../(routes)/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation";

export async function validateSession(r) {
    const session = await getServerSession(authOptions)
    if (!session && (r == true || r == undefined)) {
        redirect("/auth/login")
    } else return session;
}
