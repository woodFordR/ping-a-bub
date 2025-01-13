import { describe, it, expect } from 'vitest';
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
  objectID: 1,
};

const quoteTwo = {
  category: 'funny',
  author_name: 'squish',
  text: 'quack! quack! quack!',
  num_likes: '32',
  objectID: 2,
};

const quoteThree = {
  category: 'funny',
  author_name: 'woody',
  text: 'woof! woof! woof!',
  num_likes: '51',
  objectID: 3,
};

const quotes = [quoteOne, quoteTwo, quoteThree]

describe('quotesReducer', () => {
  it('removes a quote from all quotes', () => {
    expect(true).toBe(true);
  });
});

describe('something truthy or falsey', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  });

  it('false to be false', () => {
    expect(false).toBe(false);
  });
});

