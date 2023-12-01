import { connectDB } from "@/util/database"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    //const date = new Date();

    // interface Member {
    //     id : string
    //     password : string
    //     publicKey : string
    //     email : string
    //     name : string
    //     role : number
    //     updatedAt : Date | null
    //     createAt : Date
    // }
    
    // const sampleMember : Member = {
    //     id : "tyrannojung",
    //     password : "1234",
    //     publicKey : "0x84207aCCB87EC578Bef5f836aeC875979C1ABA85",
    //     email : "tyrannojung@naver.com",
    //     name : "dawoon jung",
    //     role : 1,
    //     updatedAt : null,
    //     createAt : date
    // }

    if (req.method == 'POST'){
        try {
            const db = (await connectDB).db("forum")
            let result = await db.collection('member').insertOne(req.body);
            return res.redirect(302,'/list')
        } catch (error) {
            return res.status(500).json('db연결 애러')
        }

    }

}