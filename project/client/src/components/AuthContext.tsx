import { useState, useEffect, useContext, createContext } from "react";
import React from 'react'

// help with this file: https://www.youtube.com/watch?v=h3_YKC2VGfE 

type AuthContextType= {
    user: string | null;
    token: string | null;
    login: (token: string) => Promise<void>
    logout: ()=> void;
    isLoggedIn: boolean;
}


type Props = { children: React.ReactNode };

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

//added to main.tsx

//AuthContext makes authentication state accessible to the whole app
function AuthContextFunc({children}: Props) {

    const [isReady, setIsReady] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);


    useEffect(()=>{
        const token=localStorage.getItem("token")
        const init= async()=>{

            // if no token 
            if(!token){
                setIsReady(true)
                return
            }

            try {
                const response= await fetch("/user/info",{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if(!response.ok){
                    localStorage.removeItem("token")
                    setIsReady(true)
                    return

                }

                const data= await response.json()
                setToken(token)
                setUser(data.email) 

                
            } catch (error) {
                
            }
            setIsReady(true)

        }
        init()
    },[])


    // Login function
    const login = async(token:string)=>{

        localStorage.setItem("token",token)

        const response= await fetch("/user/info", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data= await response.json()
        setToken(token)
        setUser(data.email)

    }

    // remove token when user logs out
    const logout=()=>{
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
    }

    // check if user is logged in
    const isLoggedIn = !!user
  
    
    return (
    <AuthContext.Provider
      value={{user, token, login, logout, isLoggedIn }}
    >
      {isReady ? children : null}
    </AuthContext.Provider>
  );

  
}

export const useAuth = ()=> useContext(AuthContext)
export default AuthContextFunc