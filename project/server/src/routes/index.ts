import {Request, Response, Router} from "express"
import { IUser, User } from "../models/User"
import {Result, ValidationError, validationResult } from 'express-validator'
import jwt, {JwtPayload} from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { validateToken, CustomRequest} from '../middleware/validateToken'
import dotenv from "dotenv"
import {registerValidation, loginValidation} from "../validators/inputValidation"
import Document, {Ipermissions} from "../models/Document"
import mongoose from "mongoose"

dotenv.config()

const router:Router = Router()


// Route copied from week8 exercise index.ts file.
// POST /user/register
router.post("/user/register", registerValidation, async(req: Request, res: Response)=>{

    //checking error
        const errors: Result<ValidationError>=validationResult(req)
        if(!errors.isEmpty()){
            console.log(errors)
            return(res.status(400).json({error:errors.array()}))
        }

    try{
        //finding if user exists already
        const user: IUser | null = await User.findOne({email: req.body.email})
        
        console.log(user)

        if(user){
            //same email twice
            return res.status(403).json({email: "Email already in use."})
        }
        
        const salt : string =bcrypt.genSaltSync(10)
        const hash : string =bcrypt.hashSync(req.body.password,salt)

        //creating new user
        const newUser =await User.create({
            email: req.body.email,
            password: hash,
            
        })
        
        
        return res.status(200).json(newUser)

    } catch (error: any) {
        console.error(`${error}`)
    }
})


// Route copied from week8 exercise index.ts file
// POST /user/login
router.post("/user/login",loginValidation,async (req: Request, res: Response) =>{
        
        try {
            const user: IUser | null = await User.findOne({email: req.body.email}) 
            
            if(!user){
                return res.status(404).json({message: "User not found"})
            }

            if(bcrypt.compareSync(req.body.password, user.password)){

                const jwtPayload: JwtPayload={
                    _id: user._id,
                    email: user.email,
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

// GET /info
// Provide user information to /Home page
router.get("/user/info",validateToken, async(req: CustomRequest, res: Response) =>{

    try {
        const userId= req.user?._id
        const user=await User.findById(userId).select("email")

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        //now Home.tsx can get access to user.email and other user information
        res.status(200).json({_id: user.id, email: user.email})
        
    } catch (error:any) {
        console.error(`Error during getting user info ${error}`)
        return res.status(500).json({error: "Internal Server Error"})
        
    }

})

// POST /documents
// create new documents
router.post("/documents", validateToken, async (req: CustomRequest, res: Response) =>{

    try {
        // default values but user can change them when he/she gets routed to /documents/:id
        const newDocument= await Document.create({
            filename: "untitled",
            text: "",
           
            owner: req.user!.email,
            permissions: []
        })

        return res.status(201).json(newDocument)

        
    } catch (error:any) {
        console.error(`Error during getting documents ${error}`)
        return res.status(500).json({error: "Internal Server Error"})
        
    }

})



//GET /documents
//Used to list files in Manage.ts file 
router.get("/documents",validateToken, async(req: CustomRequest, res: Response) => {

    try {

        const documents =await Document.find({
            $or: [
                {owner: req.user!.email},
                { "permissions.users": req.user!.email }
            ]
            })

        return res.status(200).json(documents)
        
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"})
    }
})

//GET /documents/:id
// used when user wants edit specific document

// help with locking document: https://www.mongodb.com/community/forums/t/locking-documents-in-mongo/6865
// findAndModify should be atomic operation which would be suitable for this
router.get("/documents/:id",validateToken, async(req: CustomRequest, res: Response) => {

    try {
        const email = req.user!.email

        const document = await Document.findOneAndUpdate(
        {
            _id: req.params.id,
            $or: [
                { status: "free" },
                { lock: email }, // allow same user refresh
                
            ]
        },
        {
            status: "editing",
            lock: email,
        },
        { new: true }
    )

    // Checking if another user with different email has document open
    // again checking correct res status numbers: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
    // 423 should be okay here because it means locked
    if (!document) {
        return res.status(423).json({
            message: "Document already locked"
        })
    }

    // permission check after lock success. email matches the owner email or the current email matches some of the permission users email. 
    const permissionCheck=
        document.owner === email ||
        document.permissions.some(p => p.users === email)

    if (!permissionCheck) {
        return res.status(403).json({
            message: "No permission"
        })
    }

    return res.status(200).json(document)

    } catch (error) {
            return res.status(500).json({error: "Internal Server Error"})
        }
})

//PUT /documents/:id
//Used when user wants to edit files. Users with viewing permissons cant access this.
router.put("/documents/:id",validateToken, async(req: CustomRequest, res: Response) => {

    try {
        const document =await Document.findById(req.params.id)

        // if not found
        if(!document){
            return res.status(404).json({message: "Document not found"})
        }

        //checking if user has editing permissionns
        const editPermission=document.permissions.find(p => p.users === req.user!.email && p.permissionType ==="edit")

        //checking if user is the owner of the file
        const ownerCheck= document.owner.toString() === req.user!.email

        
        // if user is not the owner or does't have editing permission: 
        if(!editPermission && !ownerCheck){
            return res.status(403).json({message: "No permission to this document"})
        }

        // take filename and text from request body ? means that if it doesnt exist it becomes null
        const {filename ,  text} : {filename?: string, text?: string}= req.body
        //same here but default into empty array and make sure the type is Ipermissions
        const permissions: Ipermissions[]= req.body.permissions ?? []
        

        // change filename if the user wants to
        if(filename !== undefined){
            document.filename=filename
        }

        // change text
        if(text !== undefined && text !== ""){
            document.text =text
        }

        // only owner can add permissions. Permissions updated
        if( ownerCheck && permissions){

            

            const Allpermissions= [... document.permissions]
            // going through existing permissions and placing new permisson if user doesnt have one 
            for(const element of permissions){

                // permissions can only be given to existing users
                const validUserCheck= await User.findOne({
                    email: element.users
                })
                // if invalid email show error message 
                if(!validUserCheck){
                    return res.status(400).json({message:"User does not exist"})
                }

                // no duplicate permissons allowed
                const checkExisting = Allpermissions.find(
                    p => p.users === element.users
                )
                if(!checkExisting){
                    Allpermissions.push({users: element.users,
                        permissionType: element.permissionType
                }) 
                }    
            }
            
            document.permissions= Allpermissions
        }

        // updating editedAt info
        document.editedAt = new Date()


        await document.save()

        return res.status(200).json(document)
        
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"})
    }
})

//POST /documents/:id/unlock
//used to unlock documuments after user stops using them
//no validate token because if user token is expired
router.post("/documents/:id/unlock", async(req: CustomRequest, res: Response)=>{

    try {  
    const token=req.query.token as string

    // 401 = unauthorized
    if(!token){
        return res.sendStatus(401)
    }

    const tokenDecoded = jwt.verify(token, process.env.SECRET!) as JwtPayload
    const userEmail=tokenDecoded.email
    
    await Document.findOneAndUpdate(
        {_id: req.params.id, lock: userEmail},
        {status: "free", lock: null},
        {new: true}
        // reset document status free and the lock 
        )

    return res.sendStatus(200)

    } catch (error) {

        console.error(error)
        return res.sendStatus(500)
        
    }
})

// DELETE /documuments/:id
// called when user wants to delete files
router.delete("/documents/:id",validateToken, async (req: CustomRequest, res: Response) => {

    try {

        const document= await Document.findById(req.params.id)

        if(!document){
            return
        }

        const userMail= req.user!.email

        // Only owner can delete the document
        if(document.owner===userMail){
            await Document.findByIdAndDelete(document)
            return res.status(200).json({message: "File deleted successfully."})
        }


        // other users 'delete files by revoking their editing /viewing accss'
    
        //this goes all users and checks if given email has any permissions
        const permissionCheck= document.permissions.some(p => p.users === userMail)

        // if found remove permisison
        if(permissionCheck){
            document.permissions=document.permissions.filter(
                p => p.users !== userMail
            )
        }
        
        if(!permissionCheck){
            return res.status(404).json({message: "no permissions"})
        }

        await document.save()
        return res.status(200).json({message: "Removed"})

        } catch (error: any) {
            console.error(`Error while deleting file ${error}`)
            return res.status(500).json({error: "Internal Server Error"})
        }


})

// POST /documents/:id/share
// Generates link from mongoose objectId. Used when owner wants to give 
// someone viewing permission via link. 
router.post("/documents/:id/share", validateToken, async(req: CustomRequest, res: Response) =>{

    const token= new mongoose.Types.ObjectId().toString()
    const document= await Document.findById(req.params.id)

    if(!document){
        return res.status(404).json({message: "document not found"})
    }

    // only owner can share link
    if(document.owner !== req.user!.email){
        return res.status(403)
        
    }

    document.sharedToken=token

    await document.save()
    
    return res.json({
        link: `${document.sharedToken}`
    })
})

// GET /sahre/:token
// used in SharedPage.tsx to view the document to the user 
router.get("/share/:token",async(req: Request, res: Response) =>{

    const token= req.params.token as string

    const document= await Document.findOne({sharedToken: token})

    // wrong link check
    if(!document){
        return res.status(404).json({message: "wrong link"})
        
    }

    res.json(document)
})


export default router