import { PrismaClient } from '@prisma/client';

/**
 * @type {PrismaClient}
 */
let cachedClient;

export function usePrisma() {
    if (cachedClient) {
        return cachedClient;
    }

    let client = new PrismaClient()

    cachedClient = client;
    return cachedClient
}