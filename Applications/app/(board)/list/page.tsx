import { connectDB } from "@/util/database"
import ListItem from "./ListItem";
import { post } from "@/app/_types/post"

export const dynamic = 'force-dynamic'

export default async function List() {

    const db = (await connectDB).db("forum")
    let result : post[] = await db.collection('post').find<post>({}).toArray()

    result = result.map((a : post)=>{
        a._id = a._id.toString()
        return a
    })
    
    return (
        <div className="list-bg">
            <ListItem result={result} />
        </div>
    )

  }