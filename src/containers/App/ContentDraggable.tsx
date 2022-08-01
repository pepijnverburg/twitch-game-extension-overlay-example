import React, { ReactElement, useEffect, useState } from 'react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import ContentRouter from './ContentRouter';
import styled from 'styled-components/macro';
import { useSelector } from 'react-redux';
import { isEqual, max } from 'lodash';

import { RootState } from '../../state/redux/store';
import Theme from '../../styles/Theme';
import useWindowSize from '../../hooks/useWindowSize';
import { sendAnalyticsEvent, AnalyticsEventCategory, AnalyticsEventAction, MAIN_OVERLAY_ID } from '../../config/constants';

const BASE_PADDING = Theme.CONTENT_SHADOW_SIZE + 3;
const MIN_SIZE_VISIBLE = 200;
const MIN_MOVEMENT_FOR_ANALYTICS = 10;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// Add padding to not hide the Content title and box shadows.
// This also gives some space around the content box by default.
const ContentWrapper = styled.div<{spacingLeft: number}>`
  margin-top: calc(${Theme.CONTENT_TITLE_HEIGHT}px + ${BASE_PADDING}px);
  margin-right: ${BASE_PADDING}px;
  margin-bottom: ${BASE_PADDING}px;
  margin-left: ${(props) => props.spacingLeft}px;
  float: left;
`;

const ContentDraggable = (): ReactElement => {
  const topPosition = useSelector((state: RootState) => state.overlay.topPosition);
  const contentSpacingLeft = (Theme.NAV_ITEM_WIDTH + BASE_PADDING);
  const body = document.body;
  const { clientHeight } = body;
  const contentHeight = (Theme.CONTENT_DEFAULT_HEIGHT + Theme.CONTENT_SHADOW_SIZE * 2 + Theme.CONTENT_TITLE_HEIGHT);
  const defaultPositionY = (clientHeight / 100 * topPosition) - (contentHeight / 2);
  const defaultPosition = {
    x: Theme.CONTENT_DEFAULT_POSITION_X,
    y: defaultPositionY,
  };
  const [isMoved, setIsMoved] = useState(false);
  const [position, setPosition] = useState({
    x: defaultPosition.x,
    y: defaultPosition.y,
  });
  const windowSize = useWindowSize();
  const onStop = (e: DraggableEvent, data: DraggableData) => {
    const { x, y } = data;
    const deltaX = Math.abs(x - position.x);
    const deltaY = Math.abs(y - position.y);
    const maxDelta = max([deltaX, deltaY]) ?? 0;
    const shouldSendAnalytics = maxDelta > MIN_MOVEMENT_FOR_ANALYTICS;

    if (shouldSendAnalytics) {
      sendAnalyticsEvent({
        category: AnalyticsEventCategory.DRAG,
        action: AnalyticsEventAction.END_DRAG,
        value: maxDelta,
      });
    }

    setIsMoved(true);
    setPosition({ x, y });
  };

  useEffect(() => {
    const { x, y } = position;
    const { width, height } = windowSize;
    const newPosition = {
      x,
      y,
    };

    if (!isMoved) {
      newPosition.x = defaultPosition.x;
      newPosition.y = defaultPosition.y;
    }

    if (!width || !height) {
      return;
    }

    const maxX = width - MIN_SIZE_VISIBLE;
    const maxY = height - MIN_SIZE_VISIBLE;

    // check if the content is outside of the screen due to resize
    if (x > maxX) {
      newPosition.x = maxX;
    }

    if (y > maxY) {
      newPosition.y = maxY;
    }

    if (isEqual(newPosition, position)) {
      return;
    }

    setPosition(newPosition);
  }, [windowSize, position, isMoved, defaultPosition]);

  return (
      <Wrapper>
        <Draggable
          bounds={`#${MAIN_OVERLAY_ID}`}
          onStop={onStop}
          defaultPosition={defaultPosition}
          position={position}
          cancel={`.${Theme.SELECTABLE_CONTENT_CLASS}`}
        >
          <ContentWrapper spacingLeft={contentSpacingLeft}>
            <ContentRouter />
          </ContentWrapper>
        </Draggable>
      </Wrapper>
  );
};

export default ContentDraggable;
