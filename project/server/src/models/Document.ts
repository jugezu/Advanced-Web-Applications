import mongoose,{Schema} from "mongoose"


//help: https://mongoosejs.com/docs/typescript.html

interface IDocument /*extends Document*/ {
    filename: string
    text: string
    owner: string
    editedAt: Date
    createdAt: Date
    permissions: Ipermissions[]
    lock: string | null // some kind of lock is needed to prevent other users opening document at the same time
    status: string  // free or editing
    sharedToken?: string // doesnt have to exist
}

export interface Ipermissions {
    users: string
    permissionType: string
    
}



const permissionSchema = new Schema({
    users: {type: String, required: true},
    permissionType: {type: String, required: true, enum:["edit", "view"]},
})

const documentSchema = new Schema({
    filename: {type: String, required: true},
    text: {type: String},
    owner: {type: String, required: true},
    editedAt: {type: Date, default: Date.now},
    createdAt: {type: Date, default: Date.now},
    permissions: {type: [permissionSchema],default:[]},
    lock: {type: String, default: null},
    status: {type: String, enum: ["free","editing"], default:"free"},
    sharedToken: {type: String}
})


export default mongoose.model<IDocument>("Document",documentSchema)