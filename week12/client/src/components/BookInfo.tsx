import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Book {
    name: string,
    author: string,
    pages: number
}

function BookInfo() {

    const {name}=useParams()
    const [book,setBook]=useState<Book | null> (null)
    const [errors, setErrors]= useState <string | null>(null)

    const [loading, setLoading]= useState(true)

    useEffect(()=>{

        const findBook= async()=>{
        try {
            

            const res=await fetch(`/api/book/${name}`)
            const data= await res.json()

            if(!res.ok){
                setErrors(data.message)
                setLoading(false)
                return
            }

            setBook(data)
            setLoading(false)

            
        } catch (error) {
            setLoading(false)
            console.log(error)
            
        }
        
        }
        findBook()    

    },[name])

    if(loading) return <p>loading</p>

    if(errors){
        return(
            <div>
                <h1>404</h1>
                <h1>{errors}</h1>

            </div>
        )
    } 
                        


    if(!book){
        return(
            <div>
                <h1>404</h1>
                <h1>{errors}</h1>

            </div>
        )
    } 


  return (
    <div>
        <p>{book.name}</p>
        <p>{book.author}</p>
        <p>{book.pages}</p>
    </div>
  )
}

export default BookInfo