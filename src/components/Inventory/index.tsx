import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { map } from 'lodash';
import styled from 'styled-components/macro';

import { RootState } from '../../state/redux/store';
import Theme from '../../styles/Theme';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  color: ${Theme.LIGHT_TEXT_COLOR};
`;

const Inventory = (): ReactElement => {
  const items = useSelector((state: RootState) => state.inventory.items);

  return (
    <Wrapper data-testid={'inventory-item-wrapper'}>
      {map(items, (item, slotId) => {
        const itemId = item.id;
        const itemQuantity = item.quantity;
        const isValidItem = (itemId >= 0);

        return (
          <div key={slotId}>
            {isValidItem && (
              <>
                {itemId}<br/>
                {itemQuantity}
              </>
            )}
          </div>
        );
      })}
    </Wrapper>
  );
};

export default Inventory;
