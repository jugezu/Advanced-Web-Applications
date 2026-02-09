import {Request, Response, Router} from "express"
import {User, IUser} from "./models/User"
import { Topic, ITopic } from "./models/Topic"
import { body, Result, ValidationError, validationResult } from 'express-validator'
import jwt, {JwtPayload} from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validateToken, validateAdmin, CustomRequest} from './middleware/validateToken'
import dotenv from "dotenv"
import {registerValidation, loginValidation} from "./validators/inputValidation"

dotenv.config()

const router: Router = Router()


// POST /api/user/register
router.post("/api/user/register" ,registerValidation,
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
            // same email twice
            return res.status(403).json({email: "Email already in use."})
        }
        
        const salt : string =bcrypt.genSaltSync(10)
        const hash : string =bcrypt.hashSync(req.body.password,salt)

        
        const newUser =await User.create({
            email: req.body.email,
            password: hash,
            username: req.body.username,
            isAdmin: req.body.isAdmin
        })
        
        
        // if gc error remember to try res.json(newUser)
        return res.status(200).json(newUser)

    } catch (error: any) {
        console.error(`${error}`)
    }
})

// POST /api/user/login
router.post("/api/user/login",loginValidation,
    async (req: Request, res: Response) =>{
        
        try {
            const user: IUser | null = await User.findOne({email: req.body.email}) 
            
            //console.log(user)

            if(!user){
                return res.status(404).json({message: "User not found"})
            }

            if(bcrypt.compareSync(req.body.password, user.password)){

                const jwtPayload: JwtPayload={
                    _id: user._id,
                    username: user.username,
                    isAdmin: user.isAdmin
                }
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: "20m"})
                
                return res.status(200).json({success: true, token})
            }

            
            return res.status(401).json({message: "Invalid password" })

        } catch (error: any) {
            console.error(`Error during user login ${error}`)
            return res.status(500).json({error: "Internal Server Error"})
        }
})

// GET /api/topics
router.get("/api/topics", async (req: Request, res: Response) => {
    try {
        const topics: ITopic[] = await Topic.find()
        return res.status(200).json(topics)
    } catch (error: any) {
        console.log(`Error while fecthing topics ${error}`)
        return res.status(500).json({error: "Internal Server Error"})
    }
})

// POST /api/topic
router.post("/api/topic", validateToken, async(req: CustomRequest, res: Response)=>{
    try {
        const newTopic=await Topic.create({
            title: req.body.title,
            content: req.body.content,
            username: req.user?.username
            
        })
        return res.status(200).json(newTopic)
    } catch (error: any) {
        console.error(`Error while posting topic ${error}`)
        return res.status(500).json({error: "Internal Server Error"})
    }
})

// DELETE /api/topic/:id
router.delete("/api/topic/:id", validateToken, validateAdmin, async (req: CustomRequest, res: Response) => {
    
    try {
        await Topic.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "Topic deleted successfully."})
        
    } catch (error: any) {
        console.error(`Error while deleting topic ${error}`)
        return res.status(500).json({error: "Internal Server Error"})
    }
}) 



export default router