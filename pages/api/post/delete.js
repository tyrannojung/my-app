import { connectDB } from "@/util/database"

export default async function handler(request, response){
    if (request.method == 'DELETE'){
        try {
            console.log(JSON.parse(request.body)._id)
            return response.status(200).json('success')
            
        } catch (error) {
            return response.status(500).json('db연결 애러')
        }

    }

}