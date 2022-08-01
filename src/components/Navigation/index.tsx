import React, { ReactElement } from 'react';
import styled from 'styled-components/macro';
import { useSelector } from 'react-redux';

import { RootState } from '../../state/redux/store';
import NavigationItem from '../NavigationItem';
import { INVENTORY_ROUTE, SETTINGS_ROUTE } from '../../config/constants';
import useEnabledNav from '../../hooks/useEnabledNav';

const Wrapper = styled.div<{ topPosition: number }>`
  position: absolute;
  top: ${(props) => props.topPosition}%;
  float: left;
`;

const Navigation = (): ReactElement => {
  const topPosition = useSelector((state: RootState) => state.overlay.topPosition);
  const enabledNav = useEnabledNav();

  return (
    <Wrapper data-testid={'navigation'} topPosition={topPosition}>
        <NavigationItem data-testid={'navigation-inventory'} enabled={enabledNav.hasInventory} title="Inventory" navTo={INVENTORY_ROUTE} />
        <NavigationItem enabled={enabledNav.hasSettings} title="Settings" navTo={SETTINGS_ROUTE} />
    </Wrapper>
  );
};

export default Navigation;
