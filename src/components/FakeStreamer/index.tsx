import React, { ReactElement } from 'react';
import styled from 'styled-components/macro';

import { isDevelopment, FAKE_TEST_VIEWER } from '../../config/environment';
import useEnabledNav from '../../hooks/useEnabledNav';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: grey;
`;

const PreviewTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const Text = styled.div`
  padding: 10px;
  font-size: 120px;
  line-height: 1.1em;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
`;

const FakeStreamer = (): ReactElement | null => {
  const enabledNav = useEnabledNav();

  // disable on non development
  if (!isDevelopment() && !enabledNav.inConfigMode) {
    return null;
  }

  // disable in test viewer mode
  if (FAKE_TEST_VIEWER) {
    return null;
  }

  return (
    <>
      <Background />
      {!isDevelopment() && (
        <PreviewTitle>
          <Text>Preview</Text>
        </PreviewTitle>
      )}
    </>
  );
};

export default FakeStreamer;
