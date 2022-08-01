import React, { ReactElement } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router-dom';

import store from '../../state/redux/store';
import history from './history';
import Overlay from './Overlay';
import Navigation from '../../components/Navigation';
import FakeStreamer from '../../components/FakeStreamer';
import ContentDraggable from './ContentDraggable';

const App = (): ReactElement => {
  return (
    <ReduxProvider store={store}>
      <Router history={history}>
        <Overlay>
          <FakeStreamer />
          <ContentDraggable />
          <Navigation />
        </Overlay>
      </Router>
    </ReduxProvider>
  );
};

export default App;
