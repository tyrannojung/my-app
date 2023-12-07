import type { NextApiRequest, NextApiResponse } from 'next'
import { kv } from "@vercel/kv";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){

    let type = Array.isArray(req.query.type) ? req.query.type[0] : req.query.type;
    console.log(type)
    if(type === 'get1'){
        const value = req.body.info
        console.log(value)
        const user = await kv.get(value)   
        console.log("======>dbdb")
        console.log(user)     
        return res.status(200).json(user)
    }
    else {
        if(type){
            const value = JSON.parse(type)
            const user = await kv.get(value.info)
            console.log("=====>")
            console.log(user)
            return res.status(200).json(user)
        }

    }

}