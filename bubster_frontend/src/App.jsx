import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const welcome = {
    greeting: ">>welcome<<",
    title: "bubster<<>>dashboard"
  }
  const quotes = [
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
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const searchedQuotes = quotes.filter((quote) =>
    quote.text.includes(searchTerm)
  )

  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}</h1>

      <Search onSearch={handleSearch} />

      <hr />

      <List quotes={searchedQuotes} />
    </div>
  )
}

const Search = (props) => (
  <div>
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" onChange={props.onSearch} />
  </div>
);

const List = (props) => (
  <ul>
    {props.quotes.map((quote) => (
      <Quote key={quote.id} quote={quote} />
    ))}
  </ul>
);

const Quote = (props) => (
  <li>
    <span>{props.quote.category}</span>
    <span>{props.quote.author_name}</span>
    <span>{props.quote.text}</span>
  </li>
);

export default App
