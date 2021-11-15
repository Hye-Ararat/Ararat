import { NextResponse } from "next/server";
// ik how let me how can i get the full url
export async function middleware(req) {
    console.log(req.url)
    try {
        var u = req.url
        if (!u.startsWith('http')) u = 'http://localhost' + u
        var url = new URL(u)
        var path = url.pathname
    } catch (error) {
       
      console.log(error)
    }
    
    if (path.includes("/api/v1")) return NextResponse.next();
    if (req.cookies.refresh_token && path.includes("/auth")) {
        return NextResponse.redirect("/");
    }
    if (req.cookies.refresh_token || path.includes("/auth")) {
        return NextResponse.next();
    }
    return NextResponse.redirect("/auth/login", 307);
}  