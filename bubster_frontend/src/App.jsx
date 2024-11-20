import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

const welcome = {
  greeting: ">>welcome<<",
  title: "bubster<<>>dashboard"
}

const list = [
  {
    id: "00000001",
    author_name: "Hemmingway",
    category: "funny",
    text: "An old man drinks himself stupid in a boat."
  },
  {
    id: "00000002",
    author_name: "Kennedy",
    category: "funny",
    text: "Ask what you can do for your country drunk."
  },
  {
    id: "00000003",
    author_name: "Washington",
    category: "funny",
    text: "Get down into the basement, the british are coming."
  },
]

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}</h1>

      <Search />

      <hr />

      <List />
    </div>
  )
}

const Search = () => {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

const List = () => {
  return (
    <ul>
      {list.map(function(quote) {
        return (
          <li key={quote.id}>
            <span>{quote.category}</span>
            <span>{quote.author_name}</span>
            <span>{quote.text}</span>
          </li>
        );
      })}
    </ul>
  )
}

export default App
