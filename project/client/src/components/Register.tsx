import React from 'react'
import { useState } from 'react'
import "../styles/Register.css"
import { useNavigate } from 'react-router-dom'


// set register data
const fetchData= async(email:string,password:string)=>{
    try {
        const response= await fetch("/user/register",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
                
            })
        })
        // check error
        if(!response.ok){
            throw new Error("Error fetching data")
        }

        const data= await response.json()
        console.log(data)

        
    } catch (error) {
        if(error instanceof Error){
            console.log(`Error when trying to register ${error.message}`)
        }
        
    }
}


function Register() {

    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate = useNavigate()

    // if success navigate to login page
    const handleSubmit= (e:React.FormEvent)=>{
        e.preventDefault()
        fetchData(email,password)

        navigate("/user/login")
    }

  return (
    <div className="container" style={{maxWidth: 800}}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="floatingInput">Email address</label>
            </div>

            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <button type="submit" id="register-btn" className="btn btn-warning">Register</button>
        </form>
        
        
    </div>
  )
}

export default Register
