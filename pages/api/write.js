import { connectDB } from "@/util/database"

export default async function handler(request, response){
    console.log(request.body.title);
    console.log(request.body.content);
    const db = (await connectDB).db("forum")
    let result = await db.collection('post').insertOne(request.body);
    console.log(result);

    if (request.method == 'POST'){
        return response.status(200).json('처리완료')
    }
}