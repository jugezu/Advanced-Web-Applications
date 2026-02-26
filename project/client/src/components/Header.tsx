import { Link } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { useState } from "react"

function Header() {

//help with navbar: https://getbootstrap.com/docs/4.0/components/navbar/
//help with navbar: https://getbootstrap.com/docs/5.3/components/navbar/

//checked colors with names: https://htmlcolorcodes.com/color-names/ 


//UseAuth removes Login and Register buttons/links when user is logged in
const{isLoggedIn, logout}=useAuth()

const [isOpen, setIsOpen]= useState(false)

const toggleMenu = ()=> {
    setIsOpen(!isOpen)
}

const closeMenu = ()=> {
    setIsOpen(false)
}

/*added hamuberger menu button functionality. 
Logged user can see logout and Home. 
New user sees register and login


I installed Bootsrap for Js and not for react and that 
might be the reason why the hamburger menu animations are not working. */
  return (
    
    <div className="container" style={{marginBottom:100}}>
        <nav className="navbar navbar-expand-lg fixed-top" style={{backgroundColor:'Khaki'}}>
            <div className="container-fluid">
                <a className="navbar-brand" style={{marginLeft:'10px'}} href="#">Juge Drive</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={toggleMenu}>
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>

                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link active" style={{marginLeft:'10px'}} to='/' aria-current="page" onClick={closeMenu}>Home</Link>
                    </li>

                    {!isLoggedIn && (
                        <>
                        <li className="nav-item">
                            <Link to="/user/register" className="nav-link" style={{marginLeft:'10px'}}onClick={closeMenu}>Regsiter</Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link to="/user/login" className="nav-link" style={{marginLeft:'10px'}}onClick={closeMenu}>Login</Link>
                            
                        </li>
                        </>
                    )}

                    {isLoggedIn &&(
                        <li className="nav-item">
                        <Link to="/" onClick={()=>{logout(), closeMenu() }} className="nav-link" style={{marginLeft:'10px'}}>Logout</Link>
                        </li>
                    )}

                </ul>
                
                </div>
            </div>
        </nav>
         
      
    </div>
  )
}

export default Header
