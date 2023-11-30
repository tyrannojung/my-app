import { connectDB } from "@/util/database"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if (req.method == 'POST'){
        if (req.body.title == ''){
            return res.status(500).json('너 제목 왜 안씀?')
        }
        try {
            const db = (await connectDB).db("forum")
            let result = await db.collection('post').insertOne(req.body);
            return res.redirect(302,'/list')
        } catch (error) {
            return res.status(500).json('db연결 애러')
        }

    }

}