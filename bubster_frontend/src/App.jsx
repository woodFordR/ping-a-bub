import { useCallback, useEffect, useReducer, useState } from 'react'
import axios from 'axios';
import './App.css'

const API_ENDPOINT = "http://localhost:8000/quotes/search/"

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

const quotesReducer = (state, action) => {
  switch (action.type) {
    case 'QUOTES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'QUOTES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'QUOTES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_QUOTE':
      return {
        ...state,
        data: state.data.filter(
          (quote) => action.payload.id !== quote.id
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    ''
  );
  const [url, setUrl] = useState(
    `${API_ENDPOINT}${searchTerm}`
  );
  const [quotes, dispatchQuotes] = useReducer(
    quotesReducer,
    { data: [], isLoading: false, isError: false },
  );

  const handleFetchQuotes = useCallback(async () => {
    dispatchQuotes({ type: 'QUOTES_FETCH_INIT' });

    try {
      const response = await axios.get(url)

      dispatchQuotes({
        type: 'QUOTES_FETCH_SUCCESS',
        payload: response.data,
      });
    } catch {
      dispatchQuotes({ type: 'QUOTES_FETCH_FAILURE' });
    }
  }, [url]);

  useEffect(() => {
    handleFetchQuotes();
  }, [handleFetchQuotes]);

  const handleRemoveQuote = (item) => {
    dispatchQuotes({
      type: 'REMOVE_QUOTE',
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  return (
    <div>
      <h1>{welcome.greeting}, {welcome.title}</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {quotes.isError && <p>Something went wrong ...</p>}

      {quotes.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List
          list={quotes}
          onRemoveItem={handleRemoveQuote}
        />
      )
      }
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
    {list.data.map((item) => (
      <Item
        key={item.id}
        item={item}
        onRemoveItem={onRemoveItem}
      />
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

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <button
      type="submit"
      disabled={!searchTerm}
    >
      Submit
    </button>
  </form>
);

export default App;

