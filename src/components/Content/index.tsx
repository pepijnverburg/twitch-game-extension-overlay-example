import React, { ReactElement } from 'react';
import styled from 'styled-components/macro';

import Theme from '../../styles/Theme';

const Wrapper = styled.div<{width: number; height: number}>`
  position: relative;
  float: left;
  width: ${(props): number => props.width}px;
  height: ${(props): number => props.height}px;
  background-color: ${Theme.CONTENT_BACKGROUND_COLOR};
  box-shadow: 0px 0px ${Theme.CONTENT_SHADOW_SIZE}px 3px rgba(0, 0, 0, 0.5);
`;

const ContentWrapper = styled.div<{ margin: number }>`
  margin: ${(props): number => props.margin}px;
  width: calc(100% - ${(props): number => props.margin * 2}px);
  height: calc(100% - ${(props): number => props.margin * 2}px);
`;

const TitleWrapper = styled.div`
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  height: ${Theme.CONTENT_TITLE_HEIGHT}px;
  padding: 5px 0 0 0;
  font-size: 17px;
  line-height: 29px;
  text-align: center;
  overflow: hidden;
  color: ${Theme.HIGHLIGHT_TEXT_COLOR};
  background-color: ${Theme.CONTENT_BACKGROUND_COLOR};
  box-shadow: 0px -5px 12px 1px rgba(0,0,0,0.5);
  font-family: 'RuneScape Chat Bold 2';

  &:hover {
    cursor: move;
  }
`;

export interface Props {
  children?: any;
  title?: ReactElement | string;
  width?: number;
  height?: number;
  innerMargin?: number;
}

const Content = (props: Props): ReactElement => {
  const {
    width = Theme.CONTENT_DEFAULT_WIDTH, height = Theme.CONTENT_DEFAULT_HEIGHT,
    innerMargin = 0, title, children
  } = props;

  return (
      <Wrapper width={width} height={height}>
        <ContentWrapper margin={innerMargin}>
          {children}
        </ContentWrapper>
          {title && (
            <TitleWrapper>
              {title}
            </TitleWrapper>
          )}
      </Wrapper>
  );
};

export default Content;
