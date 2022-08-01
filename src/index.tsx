import React from 'react';
import ReactDOM from 'react-dom';

import './styles/global.css';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import { ENABLE_TEST_CONTENT } from './config/environment';
import { PubSubTarget } from './config/constants';
import testContent from './__tests__/fixtures/testContent';
import store, { handleStateMessage } from './state/redux/store';
import { OnAuthorizedPayload, setAuth, getEbsToken } from './state/redux/auth';
import { logger } from './logger';

declare global {
  interface Window {
    Twitch: any;
  }
}

logger.info(`Running in ${process.env.NODE_ENV} mode...`);

// initialize event listeners for the twitch helper extension
// these will only interface with the Redux store which will in turn
// propagate the data properly to all the components
if (window?.Twitch?.ext?.configuration) {
  const setTestContentTimeout = setTimeout((): void => {
    if (!ENABLE_TEST_CONTENT) {
      return;
    }

    handleStateMessage(testContent);
  }, 500);

  window.Twitch.ext.onAuthorized(async (authPayload: OnAuthorizedPayload) => {
    clearTimeout(setTestContentTimeout);

    logger.info(`Handling authorization update...`);

    // when authorized in production the tokens will only last for 1 hour
    // for this reason we will attempt to create a new token via the EBS
    // which will be valid for a longer time
    try {
      const ebsToken = await getEbsToken(authPayload.token);
      authPayload.token = ebsToken;
      logger.info(`Successfully switched token to ebs token.`);
    } catch (error) {
      logger.error(`Using twitch token as an error occurred when fetching ebs token:`);
      logger.error(error);
    }

    store.dispatch(setAuth(authPayload));
  });

  window.Twitch.ext.listen(PubSubTarget.BROADCAST, (target: string, contentType: string, message: string) => {
    logger.info(`Handling PubSub message to update global state...`);
    handleStateMessage(message);
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
