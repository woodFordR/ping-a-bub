import {
  ChangeEvent,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import {
  StyledInput,
  StyledLabel,
} from './style';


type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: ReactNode;
}

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

export { InputWithLabel };

