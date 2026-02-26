import "../styles/Manage.css"
import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"

interface DocumentProps{
    _id: string
    owner: string
    filename: string
    createdAt: string
    editedAt: string

}

/*this function 'formatTimeAgo' was copied
 from Full stack course project I took during last summer.
 
 Link to the exact file: https://bitbucket.org/juho_koski/full-stack_juho_koski/src/master/MERN-Project/frontend/src/components/ThreadList.jsx
*/
const formatTimeAgo=(dateString: string) => {
  const diff =Date.now() -new Date(dateString).getTime()
  const minutes =Math.floor(diff/ (1000*60))

  if(minutes <1) return 'just now'
  
  if(minutes <60){
    return `${minutes} min ago`

  }
  const hours =Math.floor(minutes/60)

  if (hours<24){
    return `${hours} h ago`
  }
  const days =Math.floor(hours/24)
  return `${days} d ago`
}




function Manage() {
    const navigate = useNavigate()

    const [documents, setDocuments] = useState<DocumentProps[]>([])

    useEffect(()=>{
        fetchDocuments()
    },[])

    const fetchDocuments= async ()=> {

        const token= localStorage.getItem("token")

        // call GET /documents found in routes/index.ts to fetch document information
            const response= await fetch("/documents",{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        const data= await response.json()
        setDocuments(data)
    }

    // called when the delete button is clicked
    // this deletes the document from the database
    const deleteDoc = async(_id: string) => {
        const token= localStorage.getItem("token")

        const response= await fetch(`/documents/${_id}`,{
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }

        })
        // alert user if some error occurs during the deleting operation
       if(!response.ok){
            const errorMsg= await response.json()
            alert(errorMsg.message)
            return
        }
        // refresh view after deleting document
        fetchDocuments()
    }


    //bootstrap model
  return (
    
    <div className="table-responsive">
        <table className="table table-striped">
            <thead className="table-primary2">
                <tr>
                <th scope="col">Name</th>
                <th scope="col">Owner</th>
                <th scope="col">Created</th>
                <th scope="col">Modified</th>
                <th scope="col">Delete</th>
                </tr>
            </thead>
            
            <tbody className="table-group-divider">
                {documents.map((item)=> (

                    <tr key={item._id}>
                        
                    <th>
                        <button className="btn btn-link" style={{color:"black"}} onClick={()=> navigate(`/documents/${item._id}`)}>
                            {item.filename}
                        </button>
                    </th>
                    <th>{item.owner}</th>
                        
                    <td>{formatTimeAgo(item.createdAt)}</td>
                    <td>{formatTimeAgo(item.editedAt)}</td>

                    <td>
                        {/* Only owner can delete files*/}
                    
                        
                        <button type="button" className="btn btn-danger"
                        onClick={()=>{deleteDoc(item._id)}}>Delete</button>
                        
                    
                    </td>
                    
                   </tr> 
                ))}
                
            </tbody>
        </table>
    </div>
    
  )
}

export default Manage