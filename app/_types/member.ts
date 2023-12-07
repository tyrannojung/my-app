import { ObjectId } from "mongodb"
import { AuthenticatorDevice } from "@simplewebauthn/typescript-types";

export interface member {
    _id? : ObjectId | string
    auth_id? : string
    id? : string
    publicKey? : string
    email? : string
    name? : string
    updatedAt? : Date | null
    createAt? : Date
    devices? : UserDevice[];
}

type UserDevice = Omit<
  AuthenticatorDevice,
  "credentialPublicKey" | "credentialID"
> & {
  credentialID: string;
  credentialPublicKey: string;
};