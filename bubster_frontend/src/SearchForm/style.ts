import styled from 'styled-components';


const black = "#171212";
const white = "#ffffff";

const StyledButton = styled.button`
  background: transparent;
  border: 1px solid ${black};
  padding: 5px;
  cursor: pointer;
  font-size: 24px;

  transition: all 0.1s ease-in;

  &:hover {
    color: ${black};
    border: 1px solid ${white};

    &:hover svg > g {
      fill: ${white};
      stroke: ${white};
    }
  }
`;

export const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;

export const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
`;
