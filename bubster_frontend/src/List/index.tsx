import {
  memo,
} from 'react';
import CheckIcon from '../assets/check.svg?react';
import { FaBeer, FaCode } from "react-icons/fa";
import {
  StyledItem,
  StyledColumn,
  StyledButtonSmall,
} from './style';


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

type ItemProps = {
  item: Quote;
  onRemoveItem: (item: Quote) => void;
};

type ListProps = {
  list: QuotesState;
  onRemoveItem: (item: Quote) => void;
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
    <StyledColumn width="10%">
      <FaCode />&nbsp;{item.category}
    </StyledColumn>
    <StyledColumn width="40%">
      <FaBeer />&nbsp;{item.author_name}
    </StyledColumn>
    <StyledColumn width="40%">{item.text}</StyledColumn>
    <StyledColumn width="10%">
      <StyledButtonSmall
        type="button"
        onClick={() => onRemoveItem(item)}
      >
        <CheckIcon width="18px" height="18px" />
      </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
);

export { List };

