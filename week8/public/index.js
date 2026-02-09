const form= document.getElementById("loginForm")
const email= document.getElementById("email")
const password= document.getElementById("password")
const topicForm= document.getElementById("topicForm")
const topics=document.getElementById("topics")



const initializeRegister = () => {
    form.addEventListener("submit", (event) => {
        fetchData(event)
    })
}

const fetchData = async (event) =>{
    event.preventDefault()

    const formData= {
        email: email.value,
        password: password.value
    }

    try {

        const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
    })

    if(!response.ok){
        console.log("Error when trying to login")

    } else{
        const data = await response.json()
            
            if(data.token) {
                localStorage.setItem("token", data.token)
                //window.location.href = "/"
                location.reload()
            }
    }
        
    } catch (error) {
        console.log(`Error while trying to login: ${error.message}`)
    }
}
//

const fetchTopics= async() =>{

    try {
        const response= await fetch("/api/topics")
        const topicsData= await response.json()

        topics.innerHTML= ""

        topicsData.forEach(element => {
            const Div=document.createElement("div")
            Div.className="card z-depth-2 hoverable grey lighten-2"

            const Div2=document.createElement("div")
            Div2.className="card-content"

            const span= document.createElement("span")
            span.innerText=element.title
            span.className="card-title"

            const Paragraph= document.createElement("p")
            Paragraph.innerText= element.content

            const Paragraph2= document.createElement("p")
            Paragraph.className= "grey-text text-darken-2"
            const createdDate= new Date(element.createdAt).toLocaleString()
            Paragraph2.innerText= `Posted by ${element.username} at ${createdDate}`

            Div2.appendChild(span)
            Div2.appendChild(Paragraph)
            Div2.appendChild(Paragraph2)

            const cardAction = document.createElement("div")
            cardAction.className="card-action" 

            const deleteButton= document.createElement("button")
            deleteButton.id="deleteTopic"
            deleteButton.className="btn waves-effect waves-light"
            deleteButton.innerText="Delete"

            
            cardAction.appendChild(deleteButton)
            Div.append(Div2,cardAction)

            topics.appendChild(Div)

            const token= localStorage.getItem("token")

            deleteButton.addEventListener("click", async ()=> {

            const response= await fetch(`/api/topic/${element._id}`,{
                    method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }

            })

            if(!response.ok){
                const errorMsg= await response.json()
                alert(errorMsg.message)
                return
            }

            fetchTopics()

        })
            
        })

    } catch (error) {
        console.error("Error while fetching topics",error)
    }
}

document.addEventListener("DOMContentLoaded",()=>{

const token= localStorage.getItem("token")
//Checking if user is logged in

fetchTopics()

    if(token){

        const topicTitle=document.createElement("input")
        topicTitle.placeholder="Title"
        topicTitle.id="topicTitle"

        const topicText=document.createElement("textarea")
        topicText.placeholder="Write something here"
        topicText.id="topicText"
        topicText.className="materialize-textarea"

        const PostTopic=document.createElement("button")
        PostTopic.innerText="Post topic"
        PostTopic.id="postTopic"
        PostTopic.className="btn waves-effect waves-light"

        topicForm.append(topicTitle)
        topicForm.append(topicText)
        topicForm.append(PostTopic)

       
        topicForm.style.display="block"

        PostTopic.addEventListener("click", async()=>{

            const topicData={
                title: topicTitle.value,
                content: topicText.value

            }

            const response= await fetch("/api/topic",{
                method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(topicData)
            })
            if(response.ok){
                fetchTopics()
                
            }
        })
    } else {
        topicForm.style.display = "none"
    }

})

initializeRegister()
