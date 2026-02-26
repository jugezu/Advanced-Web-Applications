import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'


function Login() {

    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    const navigate = useNavigate()

    const {login}= useAuth()

    const handleSubmit= async (e:React.FormEvent)=>{
        e.preventDefault()

        // fetch user information and if success go to home page
        try {
         const response= await fetch("/user/login/",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
                
            })
        })

        if(!response.ok){
            return false
        }

        const data= await response.json()
        
        //AurhContext function
        await login(data.token)

        navigate("/")
        
        
        console.log(data)
        return true
        
    } catch (error) {
        if(error instanceof Error){
            console.log(`Error when trying to login ${error.message}`)
            return false
        }
        
    }

    }
    

  return (
    
    <div className="container" style={{maxWidth: 800}}>
        <h2>Login</h2>
         <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
                <input type="email" className="form-control" id="floatingInput" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="floatingInput">Email address</label>
            </div>

            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <button type="submit" id="register-btn" className="btn btn-warning">Log in</button>
        </form>
      
    </div>
  )
}

export default Login
