import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    if (req.method == 'POST'){
        if (req.body.title == '' || req.body.content == ''){
            return res.status(500).json('너 다 채워 넣고 보내')
        }
        try {
            const filter = { _id: new ObjectId(req.body._id) }; 
            const db = (await connectDB).db("forum")
            let result = await db.collection('post').updateOne(filter
                , {$set : {title: req.body.title, content:req.body.content}});
            return res.redirect(302,'/list')
        } catch (error) {
            return res.status(500).json('db연결 애러')
        }

    }

}