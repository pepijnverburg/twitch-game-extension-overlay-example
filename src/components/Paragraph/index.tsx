import React, { ReactElement } from 'react';
import styled from 'styled-components/macro';

import Theme from '../../styles/Theme';

const Wrapper = styled.div`
  margin: 0 5px 5px 5px;
  font-size: 17px;
  color: ${Theme.HIGHLIGHT_TEXT_COLOR};
`;

interface Props {
  children: any;
}

const Paragraph = (props: Props): ReactElement => {
  const { children } = props;
  
  return (
    <Wrapper>
      {children}
    </Wrapper>
  ); 
};

export default Paragraph;