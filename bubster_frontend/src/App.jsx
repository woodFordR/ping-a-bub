import { useEffect, useState } from 'react'
import './App.css'


const App = () => {
  const welcome = {
    greeting: ">>welcome<<",
    title: "bubster<<>>dashboard"
  };
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
  ];

  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem('search') || ''
  );

  useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedQuotes = quotes.filter((quote) =>
    quote.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}</h1>

      <Search search={searchTerm} onSearch={handleSearch} />

      <hr />

      <List quotes={searchedQuotes} />
    </div>
  );
};

const Search = ({ search, onSearch }) => (
  <div>
    <label htmlFor="search">Search: </label>
    <input
      id="search"
      type="text"
      value={search}
      onChange={onSearch}
    />
  </div>
);

const List = ({ quotes }) => (
  <ul>
    {quotes.map(({ id, ...quote }) => (
      <Quote key={id} {...quote} />
    ))}
  </ul>
);

const Quote = ({ category, author_name, text }) => (
  <li>
    <span>{category}</span>
    <span>{author_name}</span>
    <span>{text}</span>
  </li>
);

export default App
