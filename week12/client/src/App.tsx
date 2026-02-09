import Form from './components/Form'
import BookInfo from './components/BookInfo'
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

//npm run dev 
function App() {

  return (
    <>
     <BrowserRouter>
      <h1>books</h1>
      <Form/>
      
      <Routes>
        <Route path="/book/:name" element={<BookInfo/>}/>
        
        
      </Routes>
    
     </BrowserRouter>

     
    </>
  )
}

export default App
