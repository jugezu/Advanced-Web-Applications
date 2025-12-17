document.addEventListener("DOMContentLoaded",()=>{
const logout_btn=document.getElementById("logout")

const listOfUser = async () => {
    const token = localStorage.getItem("token")

    if(!token) {
        window.location.href = "/login.html"
        return
    }

    const response = await fetch("/api/private", {
        method: "GET",
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        console.log("invalid token")
        localStorage.removeItem("token")
        window.location.href = "/login.html"
        return response.json()

    } else {
        const data = await response.json()
        
        console.log("Token working")
        console.log(data)
    }

}

listOfUser()

const logoutFunction = () => {
    try {
        localStorage.removeItem("token")
        window.location.href= "/"
        
    } catch (error) {
        console.log(error)
        
    }
    
}

logout_btn.addEventListener("click", logoutFunction)

})