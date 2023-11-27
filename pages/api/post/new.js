import { connectDB } from "@/util/database"

export default async function handler(request, response){
    if (request.method == 'POST'){
        if (request.body.title == ''){
            return response.status(500).json('너 제목 왜 안씀?')
        }
        try {
            const db = (await connectDB).db("forum")
            let result = await db.collection('post').insertOne(request.body);
            return response.status(200).redirect('/list')
        } catch (error) {
            return response.status(500).json('db연결 애러')
        }

    }

}