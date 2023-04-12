import { NextResponse } from "next/server";
import { errorResponse, standardResponse } from "../responses";

export function allowed() {
    return NextResponse.json(standardResponse(200, 200, "User can access resource"), {
        status: 200
    });
}

export function sendData(data: any) {
    return NextResponse.json(standardResponse(201, 201, data), {
        status: 201
    })
}

export function notAllowed() {
    return NextResponse.json(errorResponse(400, 400, "You are not allowed to access this resource"), {
        status: 403
    });
}

export function rewrite(url: string, origin: string) {
    return NextResponse.redirect(new URL(url, origin))
}