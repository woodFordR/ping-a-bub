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
import { List } from './List';
import { InputWithLabel } from './InputWithLabel';


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
const white = "#ffffff";

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

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

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

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid ${black};
  padding: 5px;
  cursor: pointer;
  font-size: 24px;

  transition: all 0.1s ease-in;

  &:hover {
    color: ${black};
    border: 1px solid ${white};

    &:hover svg > g {
      fill: ${white};
      stroke: ${white};
    }
  }
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
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
  console.log('C');

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


const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}: SearchFormProps) => (
  <StyledSearchForm onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      &nbsp;<strong>search</strong>&nbsp;
    </InputWithLabel>
    <StyledButtonLarge
      type="submit"
      disabled={!searchTerm}
    >
      submit
    </StyledButtonLarge>
  </StyledSearchForm>
);

export default App;

export { quotesReducer, SearchForm };

