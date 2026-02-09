import { useState } from 'react'
import React from 'react'


const fetchData= async(name:string,author:string,pages:number)=>{
    try {
        const response= await fetch("/api/book/",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                author: author,
                pages: pages
            })
        })
        if(!response.ok){
            throw new Error("Error fetching data")
        }

        const data= await response.json()
        console.log(data)

        
    } catch (error) {
        if(error instanceof Error){
            console.log(`Error when trying to post new book ${error.message}`)
        }
        
    }
}


function Form() {

    const [name,setName]= useState("")
    const [author,setAuthor]= useState("")
    const [pages,setPages]= useState("")

    const handlesubmit= (e:React.FormEvent)=>{
        e.preventDefault()
        fetchData(name,author,Number(pages))
    }

  return (
    <div>
        
    <form onSubmit={handlesubmit}>
      <input type="text" id="name" placeholder='Name of the book' onChange={(e) => setName(e.target.value)}/>
      <input type="text" id="author" placeholder='Author' onChange={(e) => setAuthor(e.target.value)}/>
      <input type="text" id="pages" placeholder='Pages' onChange={(e) => setPages(e.target.value)}/>
      <button id="submit" type="submit">Submit</button>
     </form>
      
    </div>
  )
}

export default Form
