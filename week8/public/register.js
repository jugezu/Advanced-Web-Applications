const form= document.getElementById("registerForm")
const email= document.getElementById("email")
const password= document.getElementById("password")

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
        window.location.href ="/login.html"
    }
        
    } catch (error) {
        console.log(`Error while trying to register: ${error.message}`)
    }
}

initializeRegister()