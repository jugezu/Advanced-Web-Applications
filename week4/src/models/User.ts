import mongoose,{Document,Schema} from "mongoose";

interface IUser extends Document {
    name: string,
    todos: ITodo[] 
}

interface ITodo{
    todo: string
    checked: boolean
}

const ItodoSchema: Schema =new Schema<ITodo>({
    todo: {type: String, required: true},
    checked: {type: Boolean, default: false}
})

const IUserSchema = new Schema<IUser>({
    name: {type: String, required: true, unique: true},
    todos: {type: [ItodoSchema],default: []}
})

export default mongoose.model<IUser>("User",IUserSchema)