import { createSlice } from '@reduxjs/toolkit';
import jwt from 'jsonwebtoken';
import { logger } from '../../logger';
import { isDevelopment } from '../../config/environment';
import { AnalyticsEventCategory, sendAnalyticsEvent, AnalyticsEventAction } from '../../config/constants';
import axios from 'axios';
import { isEmpty } from 'lodash';

export interface PubsubPermissions {
  listen: string[];
  send: string[];
}

// Source: https://dev.twitch.tv/docs/extensions/reference/
export enum AuthRole {
  BROADCASTER = 'broadcaster',
  MODERATOR = 'moderator',
  VIEWER = 'viewer',
  EXTERNAL = 'external',
}

// Source: https://dev.twitch.tv/docs/extensions/reference/
export interface DecodedToken {
  exp: number;
  opaque_user_id: string;
  role: AuthRole;
  pubsub_perms: PubsubPermissions;
  channel_id: string;
  iat: number;
}

export interface AuthState {
  firstAuthentication: boolean;
  channelId: string;
  clientId: string;
  token: string;
  decodedToken: DecodedToken | null;
}

export interface OnAuthorizedPayload {
  channelId: string;
  clientId: string;
  token: string;
}

export interface SetAuthAction {
  type: string;
  payload: OnAuthorizedPayload;
}

export const initialAuthState: AuthState = {
  firstAuthentication: true,
  channelId: '',
  clientId: '',
  token: '',
  decodedToken: null,
};

export const getEbsToken = async (token: string): Promise<string> => {
  const url = `https://osrs-tools.com/api/authenticate-extension`;
  // const url = `http://localhost:3010/api/authenticate-extension`;
  const authenticateResponse = await axios.post(url, {
    token,
  });
  const ebsToken = authenticateResponse?.data?.token;
  const status = authenticateResponse?.data?.status;

  if (status === false) {
    const message = authenticateResponse?.data?.message ?? 'Could not request ebs token!';
    throw new Error(message);
  }

  if (isEmpty(ebsToken)) {
    throw new Error('An invalid ebs token was received.');
  }

  return ebsToken;
};

export const authSlice = createSlice({
  name: 'skills',
  initialState: initialAuthState,
  reducers: {
    setAuth: (state: AuthState, action: SetAuthAction): AuthState => {
      const { firstAuthentication } = state;
      const channelId = action.payload.channelId;
      const clientId = action.payload.clientId;
      const token = action.payload.token;
      const sendAuthAnalyticsEvent = (firstAction: AnalyticsEventAction, defaultAction: AnalyticsEventAction, label: string) => {

        // guard: only send first auth on load
        if (firstAuthentication) {
          sendAnalyticsEvent({
            category: AnalyticsEventCategory.AUTH, 
            action: firstAction,
            label, 
          });
          return;
        }

        // this is an auth update when the token expired
        sendAnalyticsEvent({
          category: AnalyticsEventCategory.AUTH, 
          action: defaultAction,
          label, 
        });
      };
      logger.info(`Updating to new authentication...`);
      
      if (isDevelopment()) {
        logger.info('The auth token is:');
        logger.info(token);
      }
      
      // Attempt to decode the token.
      try {
        const decodedToken = jwt.decode(token) as DecodedToken;
        const { role, opaque_user_id, channel_id } = decodedToken;

        logger.info(`Successfully logged in with the following identity:`, decodedToken);

        sendAuthAnalyticsEvent(AnalyticsEventAction.NEW_USER, AnalyticsEventAction.UPDATE_USER, opaque_user_id);
        sendAuthAnalyticsEvent(AnalyticsEventAction.NEW_ROLE, AnalyticsEventAction.UPDATE_ROLE, role);
        sendAuthAnalyticsEvent(AnalyticsEventAction.NEW_CHANNEL, AnalyticsEventAction.UPDATE_CHANNEL, channel_id);

        // Only set authentication when decoding was a success.
        return {
          ...state,
          firstAuthentication: false,
          channelId,
          clientId,
          token,
          decodedToken,
        };
      } catch (error) {
        logger.error('Could not decode JWT token. Are you sure you are logged in?');
      }

      return state;
    },
  },
});

export const { setAuth } = authSlice.actions;