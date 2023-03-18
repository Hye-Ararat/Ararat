import { type NextRequest } from 'next/server'
import {provider} from '../../../../lib/oidc'

 export async function GET(request: NextRequest) {
    console.log(provider())
}