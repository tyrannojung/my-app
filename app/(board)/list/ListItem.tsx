'use client'
import Link from 'next/link';
import { post } from "@/app/_types/post"
import { MouseEvent } from 'react';

export default function ListItem( {result} : {result : post[]}) {
    return (
        <div>
            {
                result.map((a : post, i : number) =>
                    <div className="list-item" key={i}>
                        <Link href={"/detail/"+a._id}>
                            <h4>{a.title}</h4>
                        </Link>
                        <span onClick={(e: MouseEvent<HTMLElement>)=>{
                            console.log(a._id)
                            fetch('/api/post/delete/'+a._id, {
                                method : 'DELETE'
                            }).then((r)=>{
                                r.json()
                            }).then(()=>{
                                const target = e.target as HTMLElement;
                                const parentElement = target.parentNode as HTMLElement;
                                parentElement.style.opacity = '0';
                                setTimeout(() => {
                                    parentElement.style.display = 'none';
                                }, 1000);
                            })
                        }}>🗑️</span>
                        <br />
                        <p>1월 1일</p>
                    </div>
                )
            }
        </div>
    )
}