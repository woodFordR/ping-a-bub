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

const quoteOne = {
  category: 'other',
  author_name: 'dada',
  text: 'the doggy is scared of the ice.',
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
});

