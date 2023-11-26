import { connectDB } from "@/util/database"
import Link from 'next/link';

export default async function List() {

    const db = (await connectDB).db("forum")
    let result = await db.collection('post').find().toArray()
    console.log(result)

    return (
        <div className="list-bg">
            {
                result.map((a, i) =>
                    <div className="list-item" key={i}>
                        <Link profetch={false} href={"/detail/"+a._id}>
                            <h4>{a.title}</h4>
                        </Link>
                        <p>1월 1일</p>
                    </div>
                )
            }
        </div>
    )
  }