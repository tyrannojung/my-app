import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb";

export default async function handler(request, response){
    if (request.method == 'DELETE'){
        try {
            const db = (await connectDB).db("forum")
            console.log(request.query.id)
            const query = { _id: new ObjectId(request.query.id) };
            let result = await db.collection('post').deleteOne(query);
            if(result.acknowledged && result.deletedCount == 1){
                return response.status(200).json('success')
            }
        } catch (error) {
            return response.status(500).json('db연결 애러')
        }

    }

}