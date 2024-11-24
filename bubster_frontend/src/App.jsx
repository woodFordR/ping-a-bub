import { useEffect, useState } from 'react'
import './App.css'

const initialQuotes = [
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

const welcome = {
  greeting: ">>welcome<<",
  title: "bubster<<>>dashboard"
};


const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const getAsyncQuotes = () =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { quotes: initialQuotes } }),
      2000
    )
  );

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    ''
  );
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    getAsyncQuotes().then(result => {
      setQuotes(result.data.quotes)
      setIsLoading(false);
    })
      .catch(() => setIsError(true));
  }, []);

  const handleRemoveQuote = (item) => {
    const newQuotes = quotes.filter(
      (quote) => item.id !== quote.id
    );

    setQuotes(newQuotes);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedQuotes = quotes.filter((quote) =>
    quote.text.toLowerCase().includes(searchTerm.toLowerCase())
  )


  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List
          list={searchedQuotes}
          onRemoveItem={handleRemoveQuote}
        />
      )}
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => (
  <>
    <label htmlFor={id}>{children}</label>
    &nbsp;&nbsp;&nbsp;
    <input
      id={id}
      type={type}
      value={value}
      autoFocus={isFocused}
      onChange={onInputChange}
    />
  </>
);

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item
        key={item.id}
        item={item}
        onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>{item.category}</span>
    <span>{item.author_name}</span>
    <span>{item.text}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

export default App
