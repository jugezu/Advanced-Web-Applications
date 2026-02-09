import { useState } from 'react'
import { Button} from '@mui/material'
import useFetch from './useFetch'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


import  { IJoke } from '../hooks/useJokes';


interface IData {
    type: string,
    setup: string,
    punchline: string,
    id: number
}


interface FrontPageProps{
    saveJoke?: (joke: IJoke)=> boolean
}

const FrontPage = ({saveJoke}: FrontPageProps) => {
    
    const [url, setUrl]=useState("https://official-joke-api.appspot.com/random_joke")
    const {data, loading, error}= useFetch(url)
    const joke= data as IData | null
    //let number=0
 
    const refresh=()=>{
        //number++
        setUrl(`https://official-joke-api.appspot.com/random_joke?`+Date.now())  //anything after ? does not change the url but forces to fetch data again
        //number++
    }


  return (
    <>
        <h1>Welcome to Joke Generator</h1>

        {loading && <p>Loading a joke...</p>}
        {error && <p>{error}</p>}

        <Button variant="contained" sx={{marginRight:1}} onClick={refresh}> Get Joke</Button>
        <Button variant="contained" onClick={()=>{if(joke && saveJoke){saveJoke(joke)}}}> Save Joke</Button>

        {joke && (
            <Card sx={{ maxWidth: 500, marginTop:5, marginLeft:10, marginRight:10, background:"#77d6aa"}}>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        <strong>{joke.setup}</strong>
                    </Typography>


                    <Typography gutterBottom variant="h6" component="div">
                        {joke.punchline}
                    </Typography>

                </CardContent>
            </Card>
        
      )}

    </>
  )

}
export default FrontPage
