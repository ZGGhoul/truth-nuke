import { useState } from 'react'
import './App.css'
import { initializeApp } from "firebase/app";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
        <img src="https://www.rover.com/blog/wp-content/uploads/2019/04/cute-big-eyes-1024x682.jpg" alt="" />
    </div>
  )
}

export default App
