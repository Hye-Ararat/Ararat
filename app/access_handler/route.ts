import { NextRequest } from "next/server";
import AccessHandler from "../../lib/accessHandler";
import { standardResponse } from "../../lib/responses";

export async function POST(req: NextRequest) {
    let {path, method} = await req.json();
    let request = {
        ...req,
        method: method,
        nextUrl: {
            ...req.nextUrl,
            pathname: path,
            search: req.nextUrl.search
        },
        headers: req.headers
    } as NextRequest;
    const headers = new Headers(request.headers);
  let result =  await (new AccessHandler(headers.get("Authorization")?.split("Bearer ")[1])).currentRequestAccess(request);
  console.log(result)
    return result;
}