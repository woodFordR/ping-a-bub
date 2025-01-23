import { describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import { Item } from './index';

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


describe('Item', () => {
  const item = quoteTwo;
  const handleRemoveItem = vi.fn();
  it('renders all properties', () => {
    render(<Item item={item} onRemoveItem={handleRemoveItem} />);

    expect(screen.getByText('squish')).toBeInTheDocument();
  });

  it('renders a clickable dismiss button', () => {
    render(<Item item={item} onRemoveItem={handleRemoveItem} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clicking the button calls the callback handler', () => {
    render(<Item item={quoteThree} onRemoveItem={handleRemoveItem} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

