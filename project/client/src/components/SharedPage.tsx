import { useEffect, useState } from "react";
import Editor from "./Editor";
import { useNavigate,useParams } from "react-router-dom";


interface IData{
    _id?: string
    filename: string
    text:string
    owner: string
    permissions:{
      users: string
      permissionType: string
    }[]
}

function SharedPage() {

    const {token}= useParams()
    const [document,setDocument]=useState<IData | null> (null)
    const [loading, setLoading]=useState(true)

    const navigate= useNavigate()

    // if token not found return, else fetch the document
    useEffect(()=>{
        if(!token){
            return
        }
        fetchDocument()
    },[token])

    const fetchDocument= async()=>{
        try {
            const response= await fetch(`/share/${token}`)

            //checking error messages and other errors and returning home 
            if(response.status===404){
                alert("not found")
                navigate("/")
                return
            }

            if(!response.ok){
                console.error("failed to fetch document using link")
                navigate("/")
                return
            }

            const data: IData= await response.json()
            setDocument(data)
            setLoading(false)
            
        } catch (error) {
            console.error(error)
            
        }
    }
    if(loading) return <p>Loading</p>
    if(!document) return <p>not found</p>
 
    //show user the shared document
  return (

    <div className="container">

      <h2>Document name: {document.filename}</h2>
      <p>Shared by <strong>{document.owner}</strong></p>

      <Editor value={document.text}onChange={() => {}} onlyRead={true} />
    </div>
  )
}

export default SharedPage
