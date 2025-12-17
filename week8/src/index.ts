import {Request, Response, Router} from "express"
import { compile } from "morgan"
import {User, IUser} from "./models/User"
import { resourceLimits } from "node:worker_threads"
import { body, Result, ValidationError, validationResult } from 'express-validator'
import jwt, {JwtPayload} from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validateToken } from './middleware/validateToken'
import dotenv from "dotenv"

dotenv.config()

const router: Router = Router()


// POST /api/user/register
router.post("/api/user/register" ,body("email").trim().isLength({min: 3}).escape(),
    body("password").isLength({min: 3}),
    async (req: Request, res: Response) => {

        //checking error
        const errors: Result<ValidationError>=validationResult(req)
        if(!errors.isEmpty()){
            console.log(errors)
            return(res.status(400).json({error:errors.array()}))
        }

    try{
        //finding if user exists already
        const user: IUser |null = await User.findOne({email: req.body.email})
        
        console.log(user)

        if(user){
            // 403 = forbidden
            return res.status(403).json({email: "email already in use"})
        }
        
        const salt : string =bcrypt.genSaltSync(10)
        const hash : string =bcrypt.hashSync(req.body.password,salt)

        /*const newUser: IUser={
            email: req.body.email,
            password: hash
        }*/
        const newUser =await User.create({
            email: req.body.email,
            password: hash
        })
        
        

        return res.status(200).json(newUser)

    } catch (error: any) {
        console.error(`${error}`)
    }
})

// GET /api/user/list
router.get("/api/user/list", async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await User.find()
        return res.status(200).json(users)
    } catch (error: any) {
        console.log(`Error while fecthing users ${error}`)
        return res.status(500).json({error: "Internal Server Error"})
    }

})


// POST /api/user/login
router.post("/api/user/login",body("email").trim().escape(), body("password").escape(),
    async (req: Request, res: Response) =>{
        
        try {
            const user: IUser | null = await User.findOne({email: req.body.email}) 
            //const user = users.find(user => user.email ===req.body.email)

            //console.log(user)

            if(!user){
                return res.status(401).json({message: "Login failed"})
            }

            if(bcrypt.compareSync(req.body.password, user.password)){
                const jwtPayload: JwtPayload={
                    //id: user._id,
                    email: user.email
                }
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: "2m"})
                
                return res.status(200).json({success: true, token})
            }

            return res.status(401).json({message: "Login failed" })

        } catch (error: any) {
            console.error(`Error during user login ${error}`)
            return res.status(500).json({error: "Internal Server Error"})
        }
})

// GET /api/private
router.get("/api/private" ,validateToken, async (req: Request, res: Response) =>{

    return res.status(200).json({message: "This is protected secure route!"})

})



export default router