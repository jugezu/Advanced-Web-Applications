import {Request, Response, NextFunction} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export interface CustomRequest extends Request{
    user?: JwtPayload

}

// copied from week8 exercise
export const validateToken= (req: CustomRequest, res: Response, next: NextFunction)=>{
    const token: string | undefined= req.header('authorization')?.split(" ")[1]

    if(!token) return res.status(401).json({message: "Token not found."})

    try {
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as
        string) as JwtPayload
        
        req.user = verified
        next()

    } catch (error: any) {
        res.status(401).json({message: "Token not found."})
    }
}