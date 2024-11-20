import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

const welcome = {
  greeting: ">>welcome<<",
  title: "bubster<<>>dashboard"
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>{welcome.greeting}, {welcome.title}</h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </>
  )
}

export default App
