import { type NextRequest } from 'next/server'
import oidc from '../../../../lib/oidc'

 export async function GET(request: NextRequest) {
    console.log(oidc)
}