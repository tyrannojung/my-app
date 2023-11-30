import { ObjectId } from "mongodb"

export interface post {
    _id : ObjectId | string
    title : string
    content : string
}