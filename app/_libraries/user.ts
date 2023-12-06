import { AuthenticatorDevice } from "@simplewebauthn/typescript-types";
import { kv } from "@vercel/kv";
import { cookies } from "next/headers";

const userPrefix = "nextjs-webauthn-example-user-";
const sessionPrefix = "nextjs-webauthn-example-session-";

// The original types are "Buffer" which is not supported by KV
export type UserDevice = Omit<
  AuthenticatorDevice,
  "credentialPublicKey" | "credentialID"
> & {
  credentialID: string;
  credentialPublicKey: string;
};

type User = {
  email: string;
  devices: UserDevice[];
};

export const findUser = async (email: string): Promise<User | null> => {
  console.log(`${userPrefix}${email}`);
  const aaa = await kv.get<User>('nextjs-webauthn-example-user-tyrannojung@naver.com1231234');
  console.log(aaa)
  const user = await kv.get<User>(`${userPrefix}${email}`);
  console.log(user)
  return user;
};

export const createUser = async (
  email: string,
  devices: UserDevice[]
): Promise<User> => {
  const user = await findUser(email);

  if (user) {
    throw new Error("User already exists");
  }
  console.log("======>")
  console.log(`${userPrefix}${email}`)
  await kv.set(`${userPrefix}${email}`, { email, devices });
  const aaa = await kv.get<User>(`${userPrefix}${email}`);
  console.log("======>")
  console.log(aaa)
  return { email, devices };
};

type SessionData = {
  currentChallenge?: string;
  email?: string;
};

export const getSession = async (id: string) => {
  return kv.get<SessionData>(`${sessionPrefix}${id}`);
};

export const createSession = async (id: string, data: SessionData) => {
  return kv.set(`${sessionPrefix}${id}`, JSON.stringify(data));
};

export const getCurrentSession = async (): Promise<{
  sessionId: string;
  data: SessionData;
}> => {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session-id");

  if (sessionId?.value) {
    const session = await getSession(sessionId.value);

    if (session) {
      return { sessionId: sessionId.value, data: session };
    }
  }

  const newSessionId = Math.random().toString(36).slice(2);
  const newSession = { currentChallenge: undefined };
  cookieStore.set("session-id", newSessionId);

  await createSession(newSessionId, newSession);

  return { sessionId: newSessionId, data: newSession };
};

export const updateCurrentSession = async (
  data: SessionData
): Promise<void> => {
  const { sessionId, data: oldData } = await getCurrentSession();

  await createSession(sessionId, { ...oldData, ...data });
};