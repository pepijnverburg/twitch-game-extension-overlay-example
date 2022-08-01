import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { includes } from 'lodash';

import { RootState } from '../state/redux/store';
import { AuthRole } from '../state/redux/auth';
import useQueryParams from './useQueryParams';
import { FAKE_TEST_VIEWER } from '../config/environment';
import { useLocation } from 'react-router-dom';
import { TAB_ROUTES } from '../config/constants';

interface UseEnabledNav {
  inConfigMode: boolean;
  hasTabOpen: boolean;
  hadTabOpen: boolean;
  hasSettings: boolean;
	hasAny: boolean;
  hasInventory: boolean;
}

const CONFIG_MODE_VALUES = ['config', 'dashboard'];

const useEnabledNav = (): UseEnabledNav => {
  const queryParams = useQueryParams();
  const modeQueryParam = queryParams.get('mode');
  const [inConfigMode] = useState(includes(CONFIG_MODE_VALUES, modeQueryParam)); // only set on load
  const role = useSelector((state: RootState) => state.auth.decodedToken?.role);
  const hasSettings = (role === AuthRole.BROADCASTER) && !FAKE_TEST_VIEWER;
  const hasInventory = useSelector((state: RootState) => state.inventory?.items !== null);
  const hasAny = hasInventory;
  const location = useLocation();
  const hasTabOpen = includes(TAB_ROUTES, location.pathname);
  const [hadTabOpen, setHadTabOpen] = useState(false);

  // keep track if a tab was ever openened
  useEffect(() => {
    if (hasTabOpen) {
      setHadTabOpen(true);
    }
  }, [hasTabOpen]);

  return {
    inConfigMode,
    hasTabOpen,
    hadTabOpen,
    hasSettings,
    hasAny,
    hasInventory,
  };
};

export default useEnabledNav;
