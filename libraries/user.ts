import { AuthenticatorDevice } from "@simplewebauthn/typescript-types";
import { kv } from "@vercel/kv";
import { cookies } from "next/headers";
import { member } from "@/app/_types/member"

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

export const findUser = async (email: string) => {
  const info = {
    info : `${email}`
} 
  const user2 = await fetch('http://localhost:3000/api/authapi/check/' + JSON.stringify(info), {cache: 'no-store'});
  const user: User = await user2.json();

  //const user = await kv.get<User>(`${userPrefix}${email}`);
  //console.log(user)

  return user;
};

// export const createUser = async (
//   email: string,
//   devices: UserDevice[]
// ): Promise<User> => {
//   console.log("create User=========>")
//   const user = await findUser(email);
//   console.log(user)

//   if (user) {
//     throw new Error("User already exists");
//   }
//   const user1 : member = {
//     email : email,
//     devices : devices
//   }
//   console.log("new ======user1")
//   console.log(user1)

//   await fetch('http://localhost:3000/api/authapi/create/' + JSON.stringify(user1), {cache: 'no-store'});
//   return { email, devices };
  
// };

type SessionData = {
  currentChallenge?: string;
  email?: string;
};

export const getSession = async (id: string) => {
  const session = kv.get<SessionData>(`${sessionPrefix}${id}`);
  const get_session = await session;
  console.log("success set session ====> ")
  console.log(get_session)
  return get_session;
};

export const createSession = async (id: string, data: SessionData) => {
  const session = kv.set(`${sessionPrefix}${id}`, JSON.stringify(data));
  const get_session = await session;
  console.log("success set session ====> ")
  console.log(get_session)
  return get_session;
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
