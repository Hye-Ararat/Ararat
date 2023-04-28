import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {jwtVerify} from "jose";
import { errorResponse } from "./lib/responses";
import AccessHandler from "./lib/accessHandler";
import caddyConfig from "./caddyConfig.json";


async function verifyToken(token : string) {
  let allowed;
  try {
    // @ts-ignore
    const secret = new TextEncoder().encode(process.env["ENC_KEY"]); 
        // @ts-ignore
       allowed = await jwtVerify(token, secret, {
      algorithms: ["HS256"]
    })
  } catch (error) {
    console.log(error)
    allowed = false;
  }
  return allowed; 
}

export async function middleware(request: NextRequest) {
  console.log(request.nextUrl.pathname)
  const headers = new Headers(request.headers)
  if (request.nextUrl.pathname.startsWith("/api/authentication")) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (!request.headers.get("Authorization") && request.cookies.has("access_token")) {
      headers.set("Authorization", `Bearer ${request.cookies.get("access_token")?.value}`)
    }
    if (!request.headers.get("authorization") && request.headers.has("Authorization")) {
      headers.set("authorization", request.headers.get("Authorization"))
    }
    let allowed;
    if (request.nextUrl.pathname.startsWith("/api/v1/system")) {
      allowed = request.headers.get("Authorization") == "Bearer " + process.env.COMMUNICATION_KEY;
    } else {
      allowed = await verifyToken(request.cookies.has("authorization") ? request.cookies.get("authorization").value : request.headers.has("Authorization") ? request.headers.get("Authorization")?.split(" ")[1] : "");
    }

    if (!allowed) return NextResponse.json(errorResponse(400, 400, "You are not allowed to access this resource"), {
      status: 403
    })
  }
  if (request.nextUrl.pathname.startsWith("/1.0")) {
   let origin = "https://" + caddyConfig.apps.http.servers.ararat.routes[0].match[0].host[0];
    let response = await fetch(request.nextUrl.origin + "/access_handler" + request.nextUrl.search, {
        method: "POST",
        headers: {
          "Origin": origin,
          "Authorization": request.headers.get("Authorization") || "",
          "X-LXD-oidc": "true"
        },
        body: JSON.stringify({
          path: request.nextUrl.pathname,
          method: request.method
        }),
        cache: "no-cache",
        redirect: "manual"
      })
      console.log(response.status)
      if (response.status == 200) {
        return NextResponse.next();
      } else if (response.status == 307) {
        return NextResponse.rewrite(response.headers.get("location"), origin)
      } else if (response.status == 403) {
        let data = await response.json();
        return NextResponse.json(data, {
          status: response.status,
        })
      } else if (response.status == 201) {
        let data = await response.json();
        return NextResponse.json(data, {
          status: 200,
        })
      }
       else {
       // console.log(response);
      }
      
  }
  if (!request.headers.get("Authorization") && !request.cookies.has("access_token")) {
    if (!request.cookies.has("access_token")) {
      return NextResponse.redirect(new URL("/authentication/login", request.url));
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * 
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/v1/auth|_next/static|_next/image|favicon.ico|auth|candid|.well-known|realms/Ararat|resources|access_handler).*)',
  ],
}