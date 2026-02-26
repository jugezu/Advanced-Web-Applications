import { useEffect, useState } from "react"
import Editor from "./Editor"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { useRef } from "react"
import { Toast } from "bootstrap"


interface IData{
  //to handle new and existing files
    _id?: string
    filename: string
    text:string
    owner: string
    permissions:{
      users: string
      permissionType: string
    }[]
}

function DocumentPage() {

    // help with bootsrap toasts: https://getbootstrap.com/docs/5.3/components/toasts/#live-example 
    const toastRef= useRef<HTMLDivElement | null>(null)

    // initializing toast. Only used when document is saved. 
    // Could have used alert but wanted to test how bootstrap toasts work.
    const showToast = () => {

        if (toastRef.current) {
          const toast = new Toast(toastRef.current)

          toast.show()
        }
    }

    const [shareLink,setShareLink]=useState("")

    //Creating shared link that can be send to other users
    const createShareLink= async()=>{
      const token = localStorage.getItem("token")

      //Checking if document _id is found
      if(!document?._id){
        return
      }
      //create new link 
      const response=await fetch(`/documents/${document._id}/share`,{
          method: "POST",
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      )
      // show user if link cant be created
      if(!response.ok){
        alert("failed to create new share link")
        return
      }
      
      const data= await response.json()
      setShareLink(data.link)
    }


    const [permission,setPermission]=useState("")
    const [fileName,setfileName]=useState<string> ("")
    const [friendMail,setFriendMail]=useState("")

  
    const navigate= useNavigate()
    const {id}=useParams()

    // used in return button to go back to home page
    const navigateHome= ()=>{
        navigate("/")
    }  

    const [document,setDocument]=useState<IData | null> (null)

    //getting user in useAuth and checking if it is owner of the document
    const {user}= useAuth()

    //this some() function is very good. it checks whether at least one element 
    // in the array passes the test implemented by the given function. 
    //Source: https://www.geeksforgeeks.org/typescript/typescript-array-some-method/

    const canEdit= user === document?.owner ||
    document?.permissions.some(p=> p.users === user && p.permissionType ==="edit"
  )
  // ^so the above checks if the user has editing permissions or is owner of the document^
    
  // check if user is owener so he can add permissions to other and change filename
  const ownerCheck= user ===document?.owner

    useEffect(()=>{
      fetchDocument()

    },[id],)

    // Setting the filename once when uploading a file. filename === "" prevents 
    // the filename reseting when user changes the filename and returns editing 
    // the document which would resets the filename. 
    useEffect(()=>{
      if(document && fileName === ""){
        setfileName(document!.filename)
      }

    },[document],)
    

    useEffect(()=>{

      // if user closes the website or closes the document
      //unlockDoc is called to make sure the documeent lock is released
      // help with unload handler : https://codesandbox.io/p/github/chasoft/react-beforeunload-ts/main
        const unloadHandler=()=>{
          unlockDoc()
        }
        
        window.addEventListener("beforeunload", unloadHandler)
  
        return()=>{
            unlockDoc()
            window.removeEventListener("beforeunload",unloadHandler)
        }
      },[id],)

    //help: https://stackoverflow.com/questions/79416970/navigator-sendbeacon-vs-fetch-keepalive-reliability-upon-browser-or-tab-close
    // No await fetch here because if user closes the tab document doesnt unlock
    // sendBeacon is the aswer to this problem
    const unlockDoc= async ()=>{
        const token= localStorage.getItem("token")
      // if no token or id return
        if(!token || !id){
          return
        }

        navigator.sendBeacon(`/documents/${id}/unlock?token=${token}`)

    }

    // Save changes made to document. Text and permissions
    const handleSubmit= async (e:React.FormEvent)=>{
        e.preventDefault()

        const token= localStorage.getItem("token")
        if(!document?._id){
          return
        }
        // update edited stuff
        const response=await fetch(`/documents/${document!._id}`,{
        method:"PUT",
        headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        // all edited stuff saved
        body: JSON.stringify({
            filename: fileName,
            text: document.text,
            permissions:friendMail && permission
            ? [{
              users: friendMail,
              permissionType: permission
            }]

            :null
            // if [] it would return empty array

        })
        })

        // when document saved successfully, show toast
        if(response.ok){
          showToast()
        }

        // if error for example invalid email for permissons show error message
        if(!response.ok){
          const eror=await response.json()
          alert(eror.message)
          return
        }
      }
      
    // fetching documents 
    const fetchDocument = async () =>{
      const token=localStorage.getItem("token")

      const response= await fetch(`/documents/${id}`,{
          //method: "GET",
          headers: {
              Authorization: `Bearer ${token}`
        }
      })

      // checking if res status code is 423. If it is user is send back to /home page
      if(response.status===423){
          alert("someone else is editing the document")
          navigate("/")
          return
      }
      // checking if res status code is 403. If it is user is send back to /home page
      if(response.status===403){
          alert("Permission denied")
          navigate("/")
          return
      }

      if(!response.ok){
        console.error("Failed to fetch the document")
        return
      }
      const data= await response.json()
      setDocument(data)
    }


    if(!document){
      return <p>Loading</p>
    }

    // 
  return (
  <div>
    {/* toast shows up when user saves the document*/}
    
    <div className="d-flex justify-content-center">
      <div aria-live="assertive" aria-atomic="true" className="toast align-items-center text-bg-warning border-0" role="alert" ref={toastRef}>
        <div className="d-flex">
          <div className="toast-body">
            <strong>Document saved successfully</strong>
          </div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
     </div>

     <div className="col-12">
        <button type="submit" className="btn btn-warning" onClick={navigateHome} style={{marginTop:10}}>Back to Home</button>
      </div>

    {/* same idea when adding new items to list. Help: https://react.dev/learn/updating-arrays-in-state*/}
    <Editor value={document.text}onChange={(text)=>
    setDocument({...document,text })
    }
    onlyRead={!canEdit}
    />
    {/*^^if user doesnt have editing permissions remove option to write even though the user cant save the changes */}

    <>
        {canEdit && (
            <>
            
            <form onSubmit={handleSubmit} className="row gx-3 gy-2 align-items-center" style={{marginTop:20}}>
            <div className="col-12">
                
                <label className="visually-shown" htmlFor="specificSizeInputName"> <h4>Current file name</h4></label>
                <input style={{marginBottom:20}} type="text" value={fileName } className="form-control" id="specificSizeInputName" placeholder="Set or change the name of the file" onChange={(e) => setfileName(e.target.value)}/>
            </div>

          {ownerCheck && (
            <>
            <h4>Add permissions to other users</h4>
            
            <div className="col-sm-6">
                <label className="visually-hidden" htmlFor="specificSizeInputGroupUsername" >Username</label>
                <div className="input-group">
                <div className="input-group-text">@</div>
                <input type="text" className="form-control" id="specificSizeInputGroupUsername" placeholder="Email" onChange={(e) => setFriendMail(e.target.value)}/>
                </div>
            </div>
            <div className="col-sm-6">
                
                <label className="visually-hidden" htmlFor="specificSizeSelect">Preference</label>
                <select className="form-select" id="specificSizeSelect" value={permission} onChange={(e)=> setPermission(e.target.value)}>
                <option value="">Choose...</option>
                <option value="edit">Editing permission</option>
                <option value="view">Viewing permission</option>
                </select>
            </div>

            <h4 style={{marginTop:40}}>Or share viewing rights via link</h4>
            <div className="col-12">
              <button type="button" className="btn btn-warning" style={{marginTop:10}} onClick={createShareLink}>Create share link</button>
            </div>
            
            {shareLink && (
              <div style={{marginTop: 15}}>
                <input className="form-control"value={shareLink}readOnly/>
              </div>

            )}
            </>

          )}
            <div className="col-12">
                <button type="submit" className="btn btn-danger" style={{marginTop:10}}>Save changes</button>
            </div>
            </form>

            </>
        )}
    </>   
  </div>
  )
}

export default DocumentPage