import { useState } from "react"

export interface IJoke{
    type: string,
    setup: string,
    punchline: string,
    id: number
}

const useJokes= ()=>{
    const [savedJokes,setSaved]=useState<IJoke[]>([])

    // Help with adding jokes to list: https://react.dev/learn/updating-arrays-in-state
    const saveJoke=(joke: IJoke): boolean =>{
        setSaved((previous) => [...previous, joke])

        
        return true
    }


    const deleteJoke=(id:number):boolean =>{
        const newSavedJokes: IJoke[]=[]

        for(let i=0; i<savedJokes.length; i++){
            if(savedJokes[i].id!= id){
                newSavedJokes.push(savedJokes[i])
            }
        }
        
        setSaved(newSavedJokes)
        return true
    }

    return {savedJokes,saveJoke,deleteJoke}


}

export default useJokes
export {useJokes}