import './App.css'
import DrawerAppBar from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FrontPage from './components/FrontPage'
import useJokes from './hooks/useJokes'
import SavedPage from './components/SavedPage'

//remember npm install --save-dev @types/node for future tasks

function App() {
  const {savedJokes,saveJoke,deleteJoke}=useJokes()
  
  return (
    <>
    <div>
      <BrowserRouter>
      <DrawerAppBar />
        <Routes>
          <Route path="/" element={<FrontPage saveJoke={saveJoke} />}/>
          <Route path="/saved"  element={<SavedPage savedJokes={savedJokes} deleteJoke={deleteJoke}/>}/>

        </Routes>
        
      </BrowserRouter>
      

    </div>
    </>
  )
}

export default App
