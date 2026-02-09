import { IJoke } from "../hooks/useJokes";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";

interface ISavedPageProps {
    savedJokes: IJoke[]
    deleteJoke: (id:number)=> void
}

const SavedPage =({savedJokes,deleteJoke}: ISavedPageProps)=>{
//https://mui.com/material-ui/react-card/
    return(
        <>
        <h1>Saved Jokes</h1>

        <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr)',
        gap: 2,
      }}
    >
        
        {savedJokes.length ===0 && (
            <Typography variant="h5" color="red">
                No saved jokes yet.
              </Typography>
        )}

        {savedJokes.map((joke)=>(

            <Card
                key={joke.id}
                sx={{ background:"#77d6aa", gap:2, margin:0.5}}>

                <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h5"> 
                        <strong>{joke.setup}</strong>
                    </Typography>

                    <Typography variant="h5"> 
                        {joke.punchline}
                    </Typography>

                    <Button variant="contained" onClick={() => deleteJoke(joke.id)}>Delete</Button>

                </CardContent>

            </Card>
           


            
        ))}
    </Box>

    </>
    )
}

export default SavedPage