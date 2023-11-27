import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb";

export default async function handler(request, response){
    if (request.method == 'POST'){
        if (request.body.title == '' || request.body.content == ''){
            return response.status(500).json('너 다 채워 넣고 보내')
        }
        try {
            const filter = { _id: new ObjectId(request.body._id) }; 
            const db = (await connectDB).db("forum")
            let result = await db.collection('post').updateOne(filter
                , {$set : {title: request.body.title, content:request.body.content}});
            return response.redirect(302,'/list')
        } catch (error) {
            return response.status(500).json('db연결 애러')
        }

    }

}