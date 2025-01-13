import { describe, it, expect } from 'vitest';
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
});

