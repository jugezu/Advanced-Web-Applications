import mongoose,{Document,Schema} from "mongoose";

interface IBooks extends Document {
    author: string
    name: string
    pages: number
    
}

const bookSchema = new Schema({
    author: {type: String, required: false},
    name: {type: String, required: false},
    pages: {type: Number, required: false}
})

const Books: mongoose.Model<IBooks> = mongoose.model<IBooks>("Books", bookSchema)

export {Books, IBooks}