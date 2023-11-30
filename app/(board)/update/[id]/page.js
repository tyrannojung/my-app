import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb"

export default async function Update(props){
    const db = (await connectDB).db("forum")
    let result = await db.collection('post').findOne({ _id : new ObjectId(props.params.id) })
    return (
        <div>
            <div className="p-20">
                <h4>글수정</h4>
                <form action="/api/post/update" method="POST">
                    <input type="hidden" name="_id" value={props.params.id}/>
                    <input name="title" defaultValue={result.title}/>
                    <input name="content" defaultValue={result.content}/>
                    <button type="submit">버튼</button>
                </form>
            </div>
        </div>
    )
}