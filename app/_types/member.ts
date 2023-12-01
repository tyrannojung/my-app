import { ObjectId } from "mongodb"

export interface member {
    _id : ObjectId | string
    id : string
    password : string
    publicKey : string
    email : string
    name : string
    role : number
    updatedAt : Date
    createAt : Date
}