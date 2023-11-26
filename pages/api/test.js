export default function handler(request, response){
    if (request.method)
    if (request.method == 'POST'){
        return response.status(200).json('처리완료')
    }
}