const form= document.getElementById("registerForm")
const email= document.getElementById("email")
const password= document.getElementById("password")
const username=document.getElementById("username")
const isAdmin=document.getElementById("isAdmin")

const initializeRegister = () => {
    form.addEventListener("submit", (event) => {
        fetchData(event)
    })
}

const fetchData = async (event) =>{
    event.preventDefault()

    const formData= {
        email: email.value,
        username: username.value,
        password: password.value,
        isAdmin: isAdmin.checked
        
    }

    try {

        const response = await fetch("/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
    })

    if(!response.ok){
        console.log("Error when trying to register")

    } else{
        window.location.href ="/"
    }
        
    } catch (error) {
        console.log(`Error while trying to register: ${error.message}`)
    }
}

initializeRegister()