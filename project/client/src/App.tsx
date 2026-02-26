import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import DocumentPage from './components/DocumentPage'
import SharedPage from './components/SharedPage'

// npm run dev to start server and client at the same time.

function App() {
 
  // routes
  return (
    <>
      
      <BrowserRouter>
      <Header/>

      <Routes>
        <Route path='/user/register' element={<Register/>}/>
        <Route path='/user/login' element={<Login/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/documents/:id' element={<DocumentPage/>}/>
        <Route path='/share/:token' element={<SharedPage/>}/>
      </Routes>
      
      
      </BrowserRouter>  
    </>
  )
}

export default App
