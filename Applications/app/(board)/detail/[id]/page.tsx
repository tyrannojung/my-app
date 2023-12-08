import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb"
import Link from 'next/link';
import { post } from "@/app/_types/post"

export default async function Detail({ params } : { params: { id : string } }){
    const db = (await connectDB).db("forum")
    console.log(params.id)
    let result : post | null = await db.collection('post').findOne<post>({ _id : new ObjectId(params.id) })
    if(result) {
        return (
            <div>
                <h4>상세페이지</h4>
                <h4>{result.title}</h4>
                <h4>{result.content}</h4>
                <Link href={"/update/"+result._id}>
                    ✏️
                </Link>
            </div>
        )
    }
}