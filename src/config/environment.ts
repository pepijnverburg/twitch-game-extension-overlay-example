import format from 'date-fns/format';
import packageJson from '../../package.json';

// Environment
export const isCI = (): boolean => {
	return !!process.env.REACT_APP_CI;
};
export const isDevelopment = (): boolean => {
	return process.env.NODE_ENV === 'development' || isCI();
};
export const getAppVersion = (): string => {
	return packageJson?.version;
};
export const getCacheBustingDate = (hourly?: boolean): string => {
	return format(new Date(), hourly ? 'yyyy-MM-dd-HH' : 'yyyy-MM-dd');
};

// Mobile
export const isMobile = (): boolean => {
	return false; // TODO: implement when starting work on mobile version
};
export const getHoldForRightClickTime = (): number => {
	return (isMobile() ? 1000 : -1);
};

// Testing
export const ENABLE_TEST_CONTENT = isDevelopment();
export const FAKE_TEST_VIEWER = false && isDevelopment();
