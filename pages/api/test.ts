import { connectDB } from "@/util/database"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){

    const db = (await connectDB).db("forum")
    let result = await db.collection('post').find().toArray()

    if (req.method == 'GET'){
        return res.status(200).json(result)
    }
}