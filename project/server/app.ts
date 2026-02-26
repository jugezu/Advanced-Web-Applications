import express, {Express} from "express"
import router from "./src/routes/index"
import path from "path"
import mongoose, {Connection} from "mongoose"
import morgan from "morgan"
import cors, {CorsOptions} from 'cors'
import { Request,Response } from "express"

const app: Express = express()
const port = 1234

// database name
const mongoDB: string = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise=Promise
const db: Connection = mongoose.connection


db.on("error", console.error.bind({extended: false}))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))

//important
app.use("/",router)

app.use(express.static(path.join(__dirname, "../dist")))


if(process.env.NODE_ENV==='development'){
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions))
} else if (process.env.NODE_ENV=== 'production'){
    app.use(express.static(path.resolve('../..','client', 'build')))

    app.get('*',(req:Request, res: Response)=>{
        res.sendFile(path.resolve('../..','build','index.html'))
    })
}

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`)
})



