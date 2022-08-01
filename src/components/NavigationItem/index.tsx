import React, { ReactElement } from 'react';
import styled from 'styled-components/macro';
import { Link, useLocation } from 'react-router-dom';
import classnames from 'classnames';

import { BASE_ROUTE, sendAnalyticsEvent, AnalyticsEventCategory, AnalyticsEventAction, setAnalyticsPage } from '../../config/constants';
import Theme from '../../styles/Theme';

const Wrapper = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  padding: 0 4px;
  width: ${Theme.NAV_ITEM_WIDTH}px;
  height: ${Theme.NAV_ITEM_HEIGHT}px;
  line-height: ${Theme.NAV_ITEM_HEIGHT}px;
  background: ${Theme.NAV_BACKGROUND_COLOR};
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
  text-align: center;
`;

export interface ItemProps {
  enabled?: boolean;
  title: string;
  navTo: string;
}

const NavigationItem = (props: ItemProps): ReactElement => {
  const { title, navTo, enabled = true } = props;
  const location = useLocation();
  const isSelected = (location.pathname === navTo);
  const finalNavTo = isSelected ? BASE_ROUTE : navTo;
  const wrapperClass = classnames({disabled: !enabled});
  const onClick = (): void => {
    sendAnalyticsEvent({
      category: AnalyticsEventCategory.NAVIGATION,
      action: AnalyticsEventAction.SELECT_TAB,
      label: finalNavTo,
    });
    setAnalyticsPage(finalNavTo);
  };

  if (!enabled) {
    return <></>;
  }

  return (
    <Wrapper data-testid={navTo} className={wrapperClass} onClick={onClick}>
      <Link to={finalNavTo}>
        {title}
      </Link>
    </Wrapper>
  );
};

export default NavigationItem;
