import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if (req.method == 'DELETE'){
        try {
            //3항 연산자, Array.isArray(req.query.id)이면, 1번 아닐경우 2번
            let id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
            console.log(id);
            const db = (await connectDB).db("forum")
            const query = { _id : new ObjectId(id) };
            let result = await db.collection('post').deleteOne(query);
            if(result.acknowledged && result.deletedCount == 1){
                return res.status(200).json('success')
            }
        } catch (error) {
            return res.status(500).json('db연결 애러')
        }

    }

}