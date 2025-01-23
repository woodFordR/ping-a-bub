import {
  ChangeEvent,
  FormEvent,
} from 'react';
import { InputWithLabel } from '../InputWithLabel';
import { StyledButtonLarge, StyledSearchForm } from './style';


type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

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

export default SearchForm;

