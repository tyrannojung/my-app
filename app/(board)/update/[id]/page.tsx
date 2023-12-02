import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb"
import { post } from "@/app/_types/post"


export default async function Update({ params } : { params: { id : string } }){
    const db = (await connectDB).db("forum")
    let result : post | null = await db.collection('post').findOne<post>({ _id : new ObjectId(params.id) })
    if(result) {
        return (
            <div>
                <div className="p-20">
                    <h4>글수정</h4>
                    <form action="/api/post/update" method="POST">
                        <input type="hidden" name="_id" value={params.id}/>
                        <input name="title" defaultValue={result.title}/>
                        <input name="content" defaultValue={result.content}/>
                        <button type="submit">버튼</button>
                    </form>
                </div>
            </div>
        )
    }
}