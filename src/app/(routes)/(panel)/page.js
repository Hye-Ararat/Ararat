import { validateSession } from "@/app/_lib/session";

export default async function Page() {
  const session = await validateSession();
  return <pre>{JSON.stringify(session, null, 2)}</pre>
}
