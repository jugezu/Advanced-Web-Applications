const Submit_button=document.getElementById("submit-button")
const form= document.getElementById("userForm")

form.addEventListener("submit", async function(e) {
    e.preventDefault()
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    //console.log(name.value)

    const response = await fetch("/users", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({name: name.value, email: email.value})
    })
    const userJson = await response.json()
    console.log(userJson)

    name.value= ""
    email.value=""

})

const getUsers= document.getElementById("getUsers")
const userList=document.getElementById("userList")

getUsers.addEventListener("click", async function() {
    const response= await fetch("/users")
    const result= await response.json()

    userList.innerHTML=""

    result.users.forEach(user => {
        const listIndex = document.createElement("li")
        listIndex.textContent=`${user.name} - ${user.email}`
        
        userList.appendChild(listIndex)
        
    });

})