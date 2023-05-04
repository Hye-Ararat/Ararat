import { PrismaClient, Authentication, Prisma } from "@prisma/client";
import { Adapter, AdapterPayload } from "oidc-provider";

const prisma = new PrismaClient();

const types = [
	"Session",
	"AccessToken",
	"AuthorizationCode",
	"RefreshToken",
	"DeviceCode",
	"ClientCredentials",
	"Client",
	"InitialAccessToken",
	"RegistrationAccessToken",
	"Interaction",
	"ReplayDetection",
	"PushedAuthorizationRequest",
	"Grant",
	"BackchannelAuthenticationRequest",
].reduce(
	(map, name, i) => ({ ...map, [name]: i + 1 }),
	{} as Record<string, number>
);

const prepare = (doc: Authentication) => {
	const isPayloadJson =
		doc.payload &&
		typeof doc.payload === "object" &&
		!Array.isArray(doc.payload);

	const payload = isPayloadJson ? (doc.payload as Prisma.JsonObject) : {};

	return {
		...payload,
		...(doc.consumedAt ? { consumed: true } : undefined),
	};
};

const expiresAt = (expiresIn?: number) =>
	expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

export class PrismaAdapter implements Adapter {
	type: number;

	constructor(name: string) {
		this.type = types[name];
	}

	async upsert(
		id: string,
		payload: AdapterPayload,
		expiresIn?: number
	): Promise<void> {
		const data = {
			type: this.type,
			payload: payload as Prisma.JsonObject,
			grantId: payload.grantId,
			userCode: payload.userCode,
			uid: payload.uid,
			expiresAt: expiresAt(expiresIn),
		};

		await prisma.authentication.upsert({
			where: {
				id_type: {
					id,
					type: this.type,
				},
			},
			update: {
				...data,
			},
			create: {
				id,
				...data,
			},
		});
	}

	async find(id: string): Promise<AdapterPayload | undefined> {
		const doc = await prisma.authentication.findUnique({
			where: {
				id_type: {
					id,
					type: this.type,
				},
			},
		});

		if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
			return undefined;
		}

		return prepare(doc);
	}

	async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
		const doc = await prisma.authentication.findFirst({
			where: {
				userCode,
			},
		});

		if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
			return undefined;
		}

		return prepare(doc);
	}

	async findByUid(uid: string): Promise<AdapterPayload | undefined> {
		const doc = await prisma.authentication.findUnique({
			where: {
				uid,
			},
		});

		if (!doc || (doc.expiresAt && doc.expiresAt < new Date())) {
			return undefined;
		}

		return prepare(doc);
	}

	async consume(id: string): Promise<void> {
		await prisma.authentication.update({
			where: {
				id_type: {
					id,
					type: this.type,
				},
			},
			data: {
				consumedAt: new Date(),
			},
		});
	}

	async destroy(id: string): Promise<void> {
		await prisma.authentication.delete({
			where: {
				id_type: {
					id,
					type: this.type,
				},
			},
		});
	}

	async revokeByGrantId(grantId: string): Promise<void> {
		await prisma.authentication.deleteMany({
			where: {
				grantId,
			},
		});
	}
}