import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import atob from 'atob';
import fromUnixTime from 'date-fns/fromUnixTime';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

import Theme from '../../styles/Theme';
import { RootState } from '../../state/redux/store';
import Paragraph from '../Paragraph';
import { DecodedToken } from '../../state/redux/auth';

const Wrapper = styled.div`
  margin: 20px 10px;
  text-align: center;

  b {
    color: ${Theme.HIGHLIGHT_HOVER_TEXT_COLOR};
  }
`;

const Token = styled.textarea.attrs(() => ({
  className: Theme.SELECTABLE_CONTENT_CLASS,
}))`
  word-wrap: break-word;
  width: 150px;
  height: 135px;
  background-color: ${Theme.TEXTAREA_BACKGROUND_COLOR};
  color: ${Theme.LIGHT_TEXT_COLOR};
  border: 1px solid ${Theme.TEXTAREA_BORDER_COLOR};
  outline: 0;
`;

const parseJwt = (token: string): DecodedToken => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload) as DecodedToken;
};

const Settings = (): ReactElement => {
  const token = useSelector((state: RootState) => state?.auth?.token);
  let decodedToken: DecodedToken | undefined = undefined;

  try {
    decodedToken = parseJwt(token);
  } catch (error) {
    // empty
  }

  const expiryTime = fromUnixTime(decodedToken?.exp ?? 0);
  const expiryDurationMs = differenceInMilliseconds(expiryTime, new Date());
  const tokenIsInvalid = !token || expiryDurationMs < 0;

  if (tokenIsInvalid) {
    return (
      <Wrapper>
        <Paragraph>You are not logged in and therefore the extension account settings are not available.</Paragraph>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Paragraph>It was not possible to automatically copy the token due to your browser. Token is valid for {Math.round(expiryDurationMs / 1000)} seconds. Manual copy:</Paragraph>
      <Token value={token} readOnly={true} />
    </Wrapper>
  );
};

export default Settings;
