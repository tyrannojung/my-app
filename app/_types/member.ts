import { ObjectId } from "mongodb"

export interface member {
    _id? : ObjectId | string
    id : string
    publicKey : string
    email : string
    name : string
    updatedAt : Date | null
    createAt : Date
}