import {Request, Response, Router} from "express"
import { compile } from "morgan"
import { readFile,writeFile,access } from 'node:fs/promises'
import User from './models/User'
const router: Router = Router()


// POST /add
router.post("/add", async(req: Request, res: Response) => {
    try{
        const {name,todo}= req.body

        let user= await User.findOne({name})

        if(user){
            user.todos.push({todo, checked: false})
            await user.save()

        } else {
            user = new User( {
                name,
                todos: [{todo, checked: false}]
            })
            await user.save()
            
        }
        
        res.json({message: `Todo added successfully for user ${name}.`})

    } catch (error: any) {
        console.error(`${error}`)
    }
   
})

// GET /todos/:id 
router.get("/todos/:id", async (req: Request, res: Response) => {

    try{
        const user = await User.findOne({name: req.params.id})
        
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        return res.json({todos: user.todos})
    } catch (error: any) {
        console.error(`Error: ${error}`)
    }
   
})


// PUT /update
// help from the full-stack course repo: https://bitbucket.org/juho_koski/full-stack_juho_koski/src/master/MERN-Project/backend/controllers/threadController.js

router.put("/update", async (req: Request, res: Response) => {

    try {
        const {name, index} =req.body
        const user = await User.findOne({name})

        if(!user){
            return res.status(404).json({message: "User not found."})
        }


        if(index === -1){
            return res.status(404).json({message: "User not found."})
        }

        
        // different ways to delete objects in TS:
        // available at: https://stackoverflow.com/questions/208105/how-do-i-remove-a-property-from-a-javascript-object
        user.todos.splice(index,1)
        await user.save()

        res.json({message: "Todo deleted successfully."})

    } catch (error) {
        
    }
})

// PUT /updateTodo
router.put("/updateTodo", async (req: Request, res: Response) => {

    try {
        const {name,index,checked} = req.body
        const user= await User.findOne({name})
        
        if(!user){
            return res.status(404).json({message: "User not found."})
        }

        user.todos[index].checked = checked

        await user.save()
        return res.json({ message: "Todo updated.", checked: user.todos[index].checked })
        //return res.json({ message: "Todo updated."})

    } catch (error) {
        
    }

})



export default router