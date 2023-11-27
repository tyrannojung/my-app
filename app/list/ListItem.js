'use client'
import Link from 'next/link';

export default function ListItem({result}) {
    return (
        <div>
            {
                result.map((a, i) =>
                    <div className="list-item" key={i}>
                        <Link profetch={false} href={"/detail/"+a._id}>
                            <h4>{a.title}</h4>
                        </Link>
                        <span onClick={(e)=>{
                            console.log(a._id)
                            fetch('/api/delete/'+a._id, {
                                method : 'DELETE'
                            }).then((r)=>{
                                r.json()
                            }).then(()=>{
                                e.target.parentElement.style.opacity = 0;
                                setTimeout(()=>{
                                  e.target.parentElement.style.display = 'none';
                                }, 1000)
                            })
                        }}>🗑️</span>
                        <br />
                        <span onClick={()=>{
                            fetch('/api/post/delete', {
                                method : 'DELETE',
                                body : JSON.stringify(a)
                            }).then((r)=>{
                                if(r.status == 200) {
                                    return r.json()
                                } else {
                                    // 서버가 애러코드전송시 실행할 코드
                                }
                            }).then((r)=>{
                                //성공시 실행할코드
                                console.log(r)
                            }).catch((error)=>{
                                //인터넷 문제 등으로 실패시 실행할 코드
                                console.log(error)
                            })
                        }}>2🗑️2</span>
                        <p>1월 1일</p>
                    </div>
                )
            }
        </div>
    )
}