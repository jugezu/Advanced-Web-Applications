import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MyContainer from './components/MyContainer'

//remember vite is not port 3000

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <h1>Hello World!</h1>
      <MyContainer />
    </div>
    
  )
}

export default App
