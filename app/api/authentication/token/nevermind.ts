import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    console.log(req.nextUrl);
    console.log(await req.text());
}