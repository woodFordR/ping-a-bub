import {
  ChangeEvent,
  memo,
  FormEvent,
  ReactNode,
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
import Check from './check.svg?react';

const API_ENDPOINT = "http://localhost:8000/quotes/search/"

// type definitions
type Quote = {
  id: string;
  author_name: string;
  category: string;
  text: string;
  num_likes: number;
};

type ItemProps = {
  item: Quote;
  onRemoveItem: (item: Quote) => void;
};

type ListProps = {
  list: QuotesState;
  onRemoveItem: (item: Quote) => void;
}

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

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: ReactNode;
}


// welcome message
const welcome = {
  greeting: ">>welcome<<",
  title: "bubster<<>>dashboard"
};

// styled components
const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;

  background: #7EBD01;
  background: linear-gradient(to left, #B3EBF2, #7EBD01);
  color: #171212;
`;

const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
`;

const StyledHeadlineSecondary = styled.h2`
  font-size: 24px;
`;

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span<{ width?: string; }>`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;

  transition: all 0.2s ease-in;

  &:hover {
    background: "#171212";
    color: "#ffffff";

    svg > g {
      fill: "#7EBD01";
      stroke: "#ffffff";
    }
  }
`;

const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const StyledLabel = styled.label`
  border: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;

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

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}: InputWithLabelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;&lt;&lt;&nbsp;
      <StyledInput
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className="input"
      />
      &nbsp;&gt;&gt;&nbsp;
    </>
  );
};

const List = memo(
  ({ list, onRemoveItem }: ListProps) =>
  (
    <ul>
      {list.data.map((item) => (
        <Item
          key={item.id}
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  )
);

const Item = ({ item, onRemoveItem }: ItemProps) => (
  <StyledItem>
    <StyledColumn width="10%">{item.category}</StyledColumn>
    <StyledColumn width="30%">{item.author_name}</StyledColumn>
    <StyledColumn width="50%">{item.text}</StyledColumn>
    <StyledColumn width="10%">
      <StyledButtonSmall
        type="button"
        onClick={() => onRemoveItem(item)}
      >
        <Check height="18px" width="18px" />
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
);

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

