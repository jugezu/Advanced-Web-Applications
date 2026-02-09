import { useEffect, useState } from 'react'
import "../styles/About.css"

const About = () => {

    type Post ={
        userId: number,
        id: number,
        title: string,
        body: string
    }

    const [data, setData] = useState<Post[]>([])
    
    //Help with the pagination: https://www.youtube.com/watch?v=9viiJc1WAx8
  
    const [postsPerPage, setposts] = useState(12)

    const currently= data.slice(0,postsPerPage)


    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then(response => response.json())
        .then(json => setData(json))
    }, [])

const showMore=()=> {
  setposts(postsPerPage+12)

  }

  return (
    <div>
      <h2 className='about-page'>About page</h2>
        <div  className="grid-container">

          {currently.map(post=>(

            <div  key={post.id} className='grid-item'>
                <h3 className='post-title'>{post.title}</h3>
                <p className='post-body'>{post.body}</p>
            </div>
          ))}
          
      </div>
      <button className='show-more-btn' onClick={()=>showMore()}>show more</button>

    </div>
  )
}



export default About
