import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react';

import axios from 'axios';
import styled from 'styled-components';
import './App.css'
import List from './List';
import SearchForm from './SearchForm';


// welcome gear
const API_ENDPOINT = "http://localhost:8000/quotes/search/"
const welcome = {
  greeting: ">>welcome<<",
  title: "bubster<<>>dashboard"
};

// defining theme colors #7EBD01
const lavender = "#745E96";
const pastelblue = "#B3EBF2";
const black = "#171212";

// type definitions
type Quote = {
  id: string;
  author_name: string;
  category: string;
  text: string;
  num_likes: number;
};

type QuotesState = {
  data: Quote[];
  isLoading: boolean;
  isError: boolean;
};

type QuotesFetchInitAction = {
  type: 'QUOTES_FETCH_INIT';
};

type QuotesFetchSuccessAction = {
  type: 'QUOTES_FETCH_SUCCESS';
  payload: Quote[];
};

type QuotesFetchFailureAction = {
  type: 'QUOTES_FETCH_FAILURE';
};

type QuotesRemoveAction = {
  type: 'REMOVE_QUOTE';
  payload: Quote;
};

type QuotesAction =
  QuotesFetchInitAction
  | QuotesFetchFailureAction
  | QuotesFetchSuccessAction
  | QuotesRemoveAction;

// styled components
const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;

  background: ${lavender};
  background: linear-gradient(to left, ${pastelblue}, ${lavender});
  color: ${black};
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
`;

const StyledHeadlineSecondary = styled.h2`
  font-size: 24px;
`;


const useStorageState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  const isMounted = useRef(false);

  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue] as const;
};

const quotesReducer = (
  state: QuotesState,
  action: QuotesAction
) => {
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

const getSumLikes = (quotes: QuotesState) => {
  return quotes.data.reduce(
    (result, value) => result + (value.num_likes || 0),
    0
  );
}


const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'is'
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

  const handleRemoveQuote = useCallback((item: Quote) => {
    dispatchQuotes({
      type: 'REMOVE_QUOTE',
      payload: item,
    });
  }, []);

  const handleSearchInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  const sumLikes = useMemo(
    () => getSumLikes(quotes),
    [quotes]
  );

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>{welcome.greeting}, {welcome.title}</StyledHeadlinePrimary>
      <StyledHeadlineSecondary>{sumLikes}</StyledHeadlineSecondary>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

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
    </StyledContainer>
  );
};


export default App;

export { quotesReducer };

