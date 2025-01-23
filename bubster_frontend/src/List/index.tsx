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
import { sortBy } from 'lodash';


// type definitions
type Quote = {
  id: string;
  author_name: string;
  category: string;
  text: string;
  num_likes: number;
};

type QuoteState = {
  data: Quote[];
  isLoading: boolean;
  isError: boolean;
};

type ItemProps = {
  item: Quote;
  onRemoveItem: (item: Quote) => void;
};

type ListProps = {
  list: QuoteState;
  onRemoveItem: (item: Quote) => void;
};

type SortedListObject = {
  [key: string]: (list: Quote[]) => Quote[];
};

const SORTS: SortedListObject = {
  NONE: (list) => list,
  CATEGORY: (list) => sortBy(list, 'category'),
  AUTHOR: (list) => sortBy(list, 'author'),
};

const List = memo(
  ({ list, onRemoveItem }: ListProps) => {
    const [sort, setSort] = useState({
      sortKey: 'NONE',
      isReverse: false,
    });
    const handleSort = (sortKey: string) => {
      const isReverse = sort.sortKey === sortKey && !sort.isReverse;
      setSort({ sortKey, isReverse });
    };

    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse ?
      sortFunction(list.data).reverse() :
      sortFunction(list.data);

    return (
      <ul>
        <StyledItem>
          <StyledColumn width="20%">
            <StyledButtonSmall type="button" onClick={() => handleSort('CATEGORY')} >
              <FaCode />&nbsp;category
            </StyledButtonSmall>
          </StyledColumn>
          <StyledColumn width="30%">
            <StyledButtonSmall type="button" onClick={() => handleSort('AUTHOR')} >
              <FaBeer />&nbsp;author
            </StyledButtonSmall>
          </StyledColumn>
          <StyledColumn width="30%">
            <StyledButtonSmall type="button" onClick={() => handleSort('QUOTE')} >
              <FaCode />&nbsp;quotes
            </StyledButtonSmall>
          </StyledColumn>
          <StyledColumn width="20%">
            <FaBeer />&nbsp;actions
          </StyledColumn>
        </StyledItem>
        <StyledBar />
        {
          sortedList.map((item: Quote) => (
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

