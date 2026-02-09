import { Request, Response,Router } from "express";
import { compile } from "morgan";
import { IBooks,Books } from "../models/Books";


const router: Router =Router()

router.post("/api/book/", async (req:Request, res:Response)=>{
    try {
        const {author,name,pages}= req.body
        
                let book= await Books.findOne({name})
        
                if(!book){
                    book = new Books( {
                        name,
                        author,
                        pages
                    })
                    await book.save()
                    return res.status(200).json({message: `ok`})
                } else {
                    return res.status(400).json({message: `Book '${name}' already exists.`})
                }
                
    } catch (error:any) {
        console.error(`${error}`)     
    }

})

router.get("/api/book/:name" ,async(req: Request, res: Response)=>{

    try {
         const bookName= req.params.name

        //find book with same name
        const book= await Books.findOne({name: bookName})

        if(!book){ 
            return res.status(404).json({message: ': This is not the webpage you are looking for'})
        }
        return res.status(200).json(book)
        
    } catch (error:any) {
        console.error(`${error}`)
        return res.status(500)
    }
   
})

export default router