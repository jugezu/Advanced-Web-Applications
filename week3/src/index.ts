import {Request, Response, Router} from "express"
import fs from "fs"
import { compile } from "morgan"

const router: Router = Router()

//used in  POST /user
let users: TUser[] = []
type TUser = {
    name: string,
    email: string,
}

//GET /hello 
router.get("/hello", (req: Request, res: Response) => {
    
    try{
        res.json({ msg: "Hello world!" })
    } catch (error: any) {
        console.error(`Error parsing JSON: ${error}`)
    }
   
})

// GET /echo/:id
router.get("/echo/:id", (req: Request, res: Response) => {

    let id= req.params.id;

    try{
        res.json({id})
        
    } catch (error: any) {
        console.error(`Error parsing JSON: ${error}`)
    }
   
})

// POST /sum 
router.post("/sum", (req: Request, res: Response) => {

    let {numbers} = req.body

    let result: number=0;
    //summarize numbers and sen the result back
    try{
       numbers.forEach((i: number) => {
        result = result + i

       })
        res.json({ sum: result })

    } catch (error: any) {
        console.error(`Error parsing JSON: ${error}`)
    }
   
})

// POST /users
router.post("/users", (req: Request, res: Response) => {
    try{
        const {name,email}= req.body
        const addUser: TUser= {name,email}
        users.push(addUser)
        res.json({message: "user successfully added"})

    } catch (error: any) {
        console.error(`Error parsing JSON: ${error}`)
    }
   
})

// GET /users  
// returns users 
router.get("/users", (req: Request, res: Response) => {
    try{
        res.status(201).json({users})     
        
    } catch (error: any) {
        console.error(`${error}`)
    }
   
})


export default router