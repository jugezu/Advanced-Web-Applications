const Submit_button=document.getElementById("submit-data")
const form= document.getElementById("todoForm")
const message=document.getElementById("message")

let lastUser= null;

form.addEventListener("submit", async function(e) {
    e.preventDefault()
    const userInput = document.getElementById("userInput")
    const todoInput = document.getElementById("todoInput")
    //console.log(name.value)

    const response = await fetch("/add", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({name: userInput.value, todo: todoInput.value})
    })
    const userJson = await response.json()
    console.log(userJson)

    message.textContent = userJson.message

    userInput.value=""
    todoInput.value=""

})


const searchForm= document.getElementById("searchForm")
const searchInput=document.getElementById("searchInput")
const search=document.getElementById("search")
const unorderedList= document.getElementById("todoList")
document.body.appendChild(unorderedList)

const deleteButton=document.getElementById("deleteUser")
deleteButton.style.display= "none"

searchForm.addEventListener("submit", async function(e) {
    e.preventDefault()

    unorderedList.innerHTML = ""
    const username= searchInput.value

    // saving the last user searched
    lastUser = username

    try{

        const response= await fetch(`/todos/${username}`)
        const result= await response.json()

        if(response.status===404){
            message.textContent = result.message
            return
        }
        

        result.todos.forEach((todoObj,index) => {

            const li=document.createElement("li")
            const label = document.createElement("label")

            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.className = "checkBoxes"
            checkbox.id="myCheckbox"
            checkbox.checked = todoObj.checked
            checkbox.dataset.index = index

            const span = document.createElement("span")
            const a = document.createElement("a")
            a.textContent = todoObj.todo
            a.classList.add("delete-task")
            a.dataset.index=index
            
            span.appendChild(a)
            label.appendChild(checkbox)
            label.appendChild(span)
            li.appendChild(label)

            checkbox.addEventListener("change", async () => {

                const response = await fetch("/updateTodo", {

                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: lastUser,
                        index: index,
                        checked: checkbox.checked

                    })
                })
                const result= await response.json()
                message.textContent=result.message
            })

            li.addEventListener("click", async (e) => {
                if (e.target === checkbox ) return;

                const newChecked = !todoObj.checked

                const response = await fetch("/updateTodo", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: lastUser, index, checked: newChecked })
                })

                const result = await response.json();
                message.textContent = result.message;
                
                todoObj.checked = newChecked
                checkbox.checked = newChecked
                })


            a.textContent=todoObj.todo


            
            //show todos
            //a.classList.add("delete-task")
            //a.dataset.index=index
            

            // delete event listener per todo
            a.addEventListener("click", async (e) => {
                e.preventDefault()

                const response = await fetch("/update", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: lastUser, index })
                })

                const result = await response.json()
                message.textContent = result.message

                li.remove()
            })

            //li.appendChild(checkbox)
            //li.appendChild(a)
            unorderedList.appendChild(li)

        })
        
        
        deleteButton.style.display= "inline-block"

    } catch (err){
        console.error(err)
    }
    
    
})


deleteButton.addEventListener("click", async () => {
    
    if (!lastUser){
        return
    }

    const response = await fetch("/delete", {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({name: lastUser})
    })

    const result = await response.json()
    message.textContent = result.message

    unorderedList.innerHTML= ""
    deleteButton.style.display= "none"
})
