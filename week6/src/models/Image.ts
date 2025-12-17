import mongoose,{Document,Schema} from "mongoose";

interface IImage extends Document {
    filename: string
    path: string
    
}

const imageSchema = new Schema({
    filename: {type: String, required: false},
    path: {type: String, required: false}
})

const Image: mongoose.Model<IImage> = mongoose.model<IImage>("Image", imageSchema)

export {Image, IImage}

