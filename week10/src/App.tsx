//import { useState } from 'react'  I hate unused variables
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import MyContainer from './components/MyContainer'
import About from './components/About'
import "./i18n"

function App() {

  return (
    <>
      <div>
        <BrowserRouter>
          <Header />
          <Routes>
            
            <Route path="/about" element={<About />} />
            <Route path="/" element={<MyContainer />} />
            
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
