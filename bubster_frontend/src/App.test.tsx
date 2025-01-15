import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import App, {
  quotesReducer,
  Item,
  List,
  SearchForm,
  InputWithLabel,
} from './App';


vi.mock('axios');

const quoteOne = {
  category: 'other',
  author_name: 'dada',
  text: 'the doggy is scared of the ice!',
  num_likes: '4',
  id: '1',
};

const quoteTwo = {
  category: 'funny',
  author_name: 'squish',
  text: 'quack! quack! quack!',
  num_likes: '32',
  id: '2',
};

const quoteThree = {
  category: 'funny',
  author_name: 'woody',
  text: 'woof! woof! woof!',
  num_likes: '51',
  id: '3',
};

const quotes = [quoteOne, quoteTwo, quoteThree]

describe('quotesReducer', () => {
  it('removes a quote from all quotes', () => {
    const action = {
      type: 'REMOVE_QUOTE',
      payload: quoteOne,
    };
    const state = {
      data: quotes,
      isLoading: false,
      isError: false,
    };

    const newState = quotesReducer(state, action);
    const expectedState = {
      data: [quoteTwo, quoteThree],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});

describe('Item', () => {
  it('renders all properties', () => {
    render(<Item item={quoteTwo} />);
  });

  it('renders a clickable dismiss button', () => {
    render(<Item item={quoteOne} />);

    screen.getByRole('button');
    // expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clicking the button calls the callback handler', () => {
    const handleRemoveItem = vi.fn();

    render(<Item item={quoteThree} onRemoveItem={handleRemoveItem} />);
    fireEvent.click(screen.getByRole('button'));

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe('SearchForm', () => {
  const searchFormProps = {
    searchTerm: 'o',
    onSearchInput: vi.fn(),
    onSearchSubmit: vi.fn(),
  };

  it('renders the input field with its value', () => {
    render(<SearchForm {...searchFormProps} />);

    expect(screen.getByDisplayValue('o')).toBeInTheDocument();
  });

  it('renders the correct label', () => {
    render(<SearchForm {...searchFormProps} />);

    expect(screen.getByLabelText(/search/)).toBeInTheDocument();
  });

  it('calls onSearchInput on input field change', () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.change(screen.getByDisplayValue('o'), {
      target: { value: 'a' },
    });

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  it('calls onSearchSubmit on button submit click', () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.submit(screen.getByRole('button'));

    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders snapshot', () => {
    const { container } = render(<SearchForm {...searchFormProps} />);
    expect(container.firstChild).toMatchSnapshot();

  })
});

describe('App', () => {
  it('succeeds fetching data', async () => {
    const promise = Promise.resolve({
      data: quotes,
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await waitFor(async () => promise);

    expect(screen.queryByText(/Loading/)).toBeNull();
    expect(screen.getByText(/quack/)).toBeInTheDocument();
    expect(screen.getByText('other')).toBeInTheDocument();
    expect(screen.getAllByText('funny').length).toBe(2);
  });

  it('fails fetching data', async () => {
    const promise = Promise.reject();
    axios.get.mockImplementationOnce(() => promise);
    render(<App />);
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    try {
      await waitFor(async () => await promise);
    } catch (error) {
      expect(screen.queryByText(/Loading/)).toBeNull();
      expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }
  });

  it('removes a quote', async () => {
    const promise = Promise.resolve({
      data: quotes,
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<App />);
    await waitFor(async () => promise);

    expect(screen.getAllByRole('button').length).toBe(4);
    expect(screen.getByText(/dog/)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button')[1]);

    expect(screen.getAllByRole('button').length).toBe(3);
    expect(screen.queryByText(/dog/)).toBeNull();
  });

  it('searches for specific quotes', async () => {
    const exclaimPromise = Promise.resolve({
      data: quotes,
    });
    const quoteFour = {
      category: 'happy',
      author_name: 'mama',
      text: 'the wheels on the bus go round.',
      num_likes: '101',
      id: '4',
    };
    const jsPromise = Promise.resolve({
      data: [quoteFour],
    });

    axios.get.mockImplementation((text) => {
      if (text.includes('wheels')) {
        return jsPromise;
      }
      if (text.includes('is')) {
        return exclaimPromise;
      }

      throw Error;
    });

    // init render
    render(<App />);

    // data fetch
    await waitFor(async () => await exclaimPromise);

    expect(screen.queryByDisplayValue('is')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('wheels')).toBeNull();
    expect(screen.queryByText('other')).toBeInTheDocument();
    expect(screen.queryByText('happy')).toBeNull();

    // user interacts
    fireEvent.change(screen.queryByDisplayValue('is'), {
      target: {
        value: 'wheels',
      },
    });

    expect(screen.queryByDisplayValue('is')).toBeNull();
    expect(screen.queryByDisplayValue('wheels')).toBeInTheDocument();

    fireEvent.submit(screen.queryByText('submit'));

    // second data fetch
    await waitFor(async () => await jsPromise);

    expect(screen.queryByText('other')).toBeNull();
    expect(screen.queryByText('happy')).toBeInTheDocument();
  });
});

