import styled from '@emotion/styled';
import { CSSProperties } from 'react';

interface FlexProps {
  direction?: CSSProperties['flexDirection'];
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  gap?: number;
  wrap?: boolean;
  flex?: number;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  ${({ align }) => align && `align-items: ${align};`}
  ${({ justify }) => justify && `justify-content: ${justify};`}
  ${({ gap }) => gap != null && `gap: ${gap}px;`}
  ${({ wrap }) => wrap && 'flex-wrap: wrap;'}
  ${({ flex }) => flex != null && `flex: ${flex};`}
`;