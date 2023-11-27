export default function handler(request, response){
    let today = new Date();
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초
    
    if (request.method == 'GET'){
        return response.status(200).json(hours + ':' + minutes + ':' + seconds)

    }

    if (request.method == 'POST'){
        return response.status(200).json('처리완료')
    }
}