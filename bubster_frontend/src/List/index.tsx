import {
  memo,
  useState,
} from 'react';
import CheckIcon from '../assets/check.svg?react';
import { FaBeer, FaCode } from "react-icons/fa";
import {
  StyledBar,
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
  ({ list, onRemoveItem }: ListProps) => {
    const [sort, setSort] = useState('None');
    const handleSort = (sortKey) => {
      setSort(sortKey);
    }
    return (
      <ul>
        <StyledItem>
          <StyledColumn width="20%">
            <StyledButtonSmall type="button" onClick={() => handleSort('category')} >
              <FaCode />&nbsp;category
            </StyledButtonSmall>
          </StyledColumn>
          <StyledColumn width="30%">
            <StyledButtonSmall type="button" onClick={() => handleSort('author')} >
              <FaBeer />&nbsp;author
            </StyledButtonSmall>
          </StyledColumn>
          <StyledColumn width="30%">
            <StyledButtonSmall type="button" onClick={() => handleSort('quote')} >
              <FaCode />&nbsp;quote
            </StyledButtonSmall>
          </StyledColumn>
          <StyledColumn width="20%">
            <FaBeer />&nbsp;actions
          </StyledColumn>
        </StyledItem>
        <StyledBar />
        {
          list.data.map((item) => (
            <Item
              key={item.id}
              item={item}
              onRemoveItem={onRemoveItem}
            />
          ))
        }
      </ul>
    )
  }
);

const Item = ({ item, onRemoveItem }: ItemProps) => (
  <StyledItem>
    <StyledColumn width="10%">
      {item.category}
    </StyledColumn>
    <StyledColumn width="40%">
      {item.author_name}
    </StyledColumn>
    <StyledColumn width="40%">
      {item.text}
    </StyledColumn>
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

export default List;

export { Item };

