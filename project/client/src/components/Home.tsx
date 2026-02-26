import "../styles/Home.css"
import { useAuth } from './AuthContext'
import Manage from './Manage'
import { useNavigate } from 'react-router-dom'
import { useState } from "react"


function Home() {

    //Auth Context function
    const {user}=useAuth()
    const navigate=useNavigate()


    // Splitting the email from the @ sign so that 
    // the entire email doesn't appear in the welcome text
    // help: https://stackoverflow.com/questions/46570887/split-string-in-javascript-reactjs 
    const username= user? user.split("@")[0] : ""

    // crete new document and navigate to /documents/:id so the user can start editing/ giving permisisons
    const createDocument= async()=> {

        const token=localStorage.getItem("token")

        const response=await fetch("/documents",{
            method: "POST",
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        const data=await response.json()

        navigate(`/documents/${data._id}`)
    }

    const [shareInput,setShareInput]=useState("")

    //when user provides correct link, the user will get routed to /share/:id 
    //and can view the file
    const openLink=(e: React.FormEvent)=>{
        e.preventDefault()

        if(!shareInput){
            return
        }
        
        // navigate to share page to show the document.
        try {
            navigate(`/share/${shareInput}`)
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <div className="container" style={{maxWidth: 800}}>
        {!user ?(
            <>
                <h2>Register or login to start using Juge Drive</h2>
            </>
        ): (
            <>
            <div className="container">

                <h2>Welcome {username}</h2>

                    <button type="button" className="btn btn-warning" id='createBtn' style={{marginBottom: 50, marginTop:25}}
                    onClick={createDocument}>Create new file</button>
                

                <div>
                    <Manage/>
                </div>
                
            </div>
            </>    
        )}

        <h4 style={{marginTop: 50}}>View a document with a shared link</h4>
        
        <form className="d-flex" style={{justifyContent: "center", marginBottom:50 }} role="search" onSubmit={openLink}>
            <input className="form-control me-2 " type="text" placeholder="Search" aria-label="Search" value={shareInput} onChange={(e)=>setShareInput(e.target.value)}/>
            <button className="btn btn-warning" type="submit">Open</button>
        </form>
      
    </div> 
    
  )
}

export default Home

