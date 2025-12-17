import {Request, Response, Router} from "express"
import { compile } from "morgan"
import { readFile,writeFile,access } from 'node:fs/promises'
import Offer from './models/Offer'
import {Image, IImage} from "./models/Image"
import upload from "./middleware/multer-config"
import { resourceLimits } from "node:worker_threads"
const router: Router = Router()


// POST /upload
router.post("/upload", upload.single("image") ,async(req: Request, res: Response) => {
    try{
        const {title,description,price}= req.body
    
        const filename= req.file?.filename
        
        const filepath=`images/${filename}`

        
        //save image to mongoDB
        const newImage: IImage = new Image({
            filename,
            path: filepath,
        })

        await newImage.save();

        
        const offer = new Offer( {
            title,
            description,
            price,
            imageId: newImage._id || null
        })
        await offer.save()

        
        return res.status(201).json({message: `Offer added successfully ${offer} ${newImage}`})

    } catch (error: any) {
        console.error(`${error}`)
    }
})



// GET /offers 
router.get("/offers", async (req: Request, res: Response) => {

    try{
        const offers = await Offer.find()

        //Found help using promise in this website: https://10xdev.blog/promise-all-map-async-await-example/
        const result= await Promise.all(
            offers.map(async offer =>{
                const image = await Image.findById(offer.imageId)

                return{
                    title: offer.title,
                    description: offer.description,
                    price: offer.price,
                    imagePath: image ? image.path : null
                }
            })
        )
        
        if(!offers){
            return res.status(404).json({message: "offers not found"})
        }

        return res.json(result)
    } catch (error: any) {
        console.error(`Error: ${error}`)
    }
   
})
export default router