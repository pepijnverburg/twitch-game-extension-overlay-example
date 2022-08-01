import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';

import store, { RootState } from '../../state/redux/store';
import useWindowSize from '../../hooks/useWindowSize';
import { setWindowSize } from '../../state/redux/main';
import { MAIN_OVERLAY_ID } from '../../config/constants';

const Wrapper = styled.div<{ topPosition: number }>`
  position: relative;
  width: 100%;
  height: 100%;
`;

interface Props {
  children: any;
}

const Overlay = (props: Props): ReactElement => {
  const topPosition = useSelector((state: RootState) => state.overlay.topPosition);
  const { children } = props;
  const windowSize = useWindowSize();

  useEffect(() => {
    store.dispatch(setWindowSize({
      windowSize,
    }));
  }, [windowSize]);

  return (
    <Wrapper id={MAIN_OVERLAY_ID} topPosition={topPosition}>
      {children}
    </Wrapper>
  );
};

export default Overlay;
