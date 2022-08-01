import { isFunction } from 'lodash';

// Time
export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;

// Data
export const HIDDEN_PLAYER_ACTOR_NAME = 'Streamer';

// Twitch
export enum PubSubTarget {
	BROADCAST = 'broadcast',
	GLOBAL = 'global',
}

// Navigation
export const BASE_ROUTE = '/';
export const INVENTORY_ROUTE = '/inventory';
export const SETTINGS_ROUTE = '/settings';

export const TAB_ROUTES = [
  INVENTORY_ROUTE,
  SETTINGS_ROUTE,
];

// Overlay
export const MAIN_OVERLAY_ID = 'main-overlay';

// Analytics
export enum AnalyticsEventCategory {
	AUTH = 'auth',
	STATE = 'state',
	NAVIGATION = 'navigation',
  DRAG = 'drag',
  DRAG_END = 'drag-end',
}

export enum AnalyticsEventAction {
	NEW_ROLE = 'new-role',
	NEW_USER = 'new-user',
	NEW_CHANNEL = 'new-channel',
	UPDATE_ROLE = 'set-role',
	UPDATE_USER = 'set-user',
	UPDATE_CHANNEL = 'set-channel',
	SELECT_TAB = 'select-tab',
	SHOW_TAB_TOOLTIP = 'show-tab-tooltip',
	END_DRAG = 'end-drag',
}

export interface AnalyticsEvent {
	category: AnalyticsEventCategory;
	action: AnalyticsEventAction;
	label?: string;
	value?: number;
	nonInteraction?: boolean;
}

export const hasAnalytics = () => {
	return isFunction(window.ga);
}

export const sendAnalyticsEvent = (event: AnalyticsEvent) => {
	const { category, action, label, value, nonInteraction } = event;

	if (hasAnalytics()) {
		ga('send', {
			hitType: 'event',
			eventCategory: category,
			eventAction: action,
			eventLabel: label,
			eventValue: value,
			nonInteraction: nonInteraction,
		});
	}
}

export const setAnalyticsPage = (location: string) => {

	if (hasAnalytics()) {
		ga('set', 'page', location);
		ga('send', 'pageview');
	}
};
