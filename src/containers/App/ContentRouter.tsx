import React, { ReactElement, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import Theme from '../../styles/Theme';
import {
  BASE_ROUTE, INVENTORY_ROUTE, SETTINGS_ROUTE
} from '../../config/constants';
import history from './history';

import Content from '../../components/Content';
import Inventory from '../../components/Inventory';
import Settings from '../../components/Settings';
import useEnabledNav from '../../hooks/useEnabledNav';

const ContentRouter = (): ReactElement => {
  const enabledNav = useEnabledNav();

  // automatically go to the settings page
  // when opening the config page
  useEffect(() => {
    if (enabledNav.inConfigMode) {
      history.push({ pathname: '/settings' });
    }
  }, [enabledNav.inConfigMode]);

  return (
    <>
      <Switch>
        <Route exact path={BASE_ROUTE}>
        </Route>
        {enabledNav.hasInventory && (
          <Route path={INVENTORY_ROUTE}>
            <Content innerMargin={Theme.CONTENT_INNER_MARGIN}>
              <Inventory />
            </Content>
          </Route>
        )}
        {enabledNav.hasSettings && (
          <Route path={SETTINGS_ROUTE}>
            <Content>
              <Settings />
            </Content>
          </Route>
        )}
      </Switch>
    </>
  );
};

export default ContentRouter;
