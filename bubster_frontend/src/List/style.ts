import styled from 'styled-components';

const black = "#171212";
const white = "#ffffff";
const lavender = "#745E96";

export const StyledBar = styled.hr`
  border-color: ${lavender};
`

export const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

export const StyledColumn = styled.span<{ width?: string; }>`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }

  width: ${(props) => props.width};
`;

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

export const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;

