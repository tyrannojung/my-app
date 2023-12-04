import { connectDB } from "@/util/database"
import type { NextApiRequest, NextApiResponse } from 'next'
import { member } from "@/app/_types/member"

export default async function checkDUplicatedId(
    req: NextApiRequest,
    res: NextApiResponse
){
    if (req.method == 'POST'){
        try {
            console.log('여기타니???')
            const db = (await connectDB).db("forum")
            const query = { id : req.body.id };
            console.log(query)
            let result : member | null = await db.collection('member').findOne<member>(query)
            console.log(result);
            if(result){
                return res.status(200).json({ result : false, message: "The provided ID is already in use. Please choose another one." })
            } 
            return res.status(500).json({ result : true})
        } catch (error) {
            return res.status(500).json({ result : false, message: "Server error" })
        }
    }
}