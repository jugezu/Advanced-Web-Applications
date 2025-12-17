const form= document.getElementById("loginForm")
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
                window.location.href = "/"

            }
    }
        
    } catch (error) {
        console.log(`Error while trying to register: ${error.message}`)
    }
}

initializeRegister()