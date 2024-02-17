import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import {
  saga,
  sagaClearSession,
  sagaInitSessionFromCookie,
} from './saga';
import { AppGlobalState } from './types';
import { getP2TRAddressFromPublicKey } from 'utils/create-key-pair';

export const initialState: AppGlobalState = {
  encryptedPrimaryKey: undefined,
  primaryAddress: undefined,
  primaryPublicKey: undefined,
  encryptedFundingKey: undefined,
  fundingAddress: undefined,
  fundingPublicKey: undefined,
  decryptedFundingKey: undefined,
  sha256d: undefined,
  accountAddr: undefined,
};
export const AES_SALT = 'af573b66349951e3ee72f2bbfb6203ec0';

const slice = createSlice({
  name: 'appGlobalState',
  initialState,
  reducers: {
    loadProfile(state, action: PayloadAction<any>) {
      // Load profile when it counts
    },
    setAccountAddr(state, action: PayloadAction<string>) {
      state.accountAddr = action.payload;
    },
    setDecryptedFundingKey(state, action: PayloadAction<string>) {
      state.decryptedFundingKey = action.payload;
    },

    // Get session/cookie releated
    setUnauthenticated(state) {
      state.primaryPublicKey = 'unauthenticated';
    },

    setEncryptedSession(
      state,
      action: PayloadAction<{
        encryptedPhrase: string;
        encryptedPrimaryKey: string;
        encryptedFundingKey: string;
        primaryPublicKey: string;
        fundingPublicKey: string;
        sha256d: string;
      }>
    ) {
      // @ts-ignore
      state.encryptedPhrase = action.payload.encryptedPhrase;
      state.encryptedPrimaryKey = action.payload.encryptedPrimaryKey;
      state.encryptedFundingKey = action.payload.encryptedFundingKey;
      state.primaryPublicKey = action.payload.primaryPublicKey;
      state.fundingPublicKey = action.payload.fundingPublicKey;
      state.sha256d = action.payload.sha256d;
      state.primaryAddress = getP2TRAddressFromPublicKey(action.payload.primaryPublicKey);
      // state.primaryAddress = action.payload.accounts[0];

      state.fundingAddress = getP2TRAddressFromPublicKey(action.payload.fundingPublicKey);
    },

    clearSession(state) {
      state.encryptedPhrase = undefined;
      state.encryptedPrimaryKey = undefined;
      state.encryptedFundingKey = undefined;
      state.primaryPublicKey = undefined;
      state.fundingPublicKey = undefined;
      state.primaryAddress = undefined;
      state.fundingAddress = undefined;
      state.sha256d = undefined;
    },

    initSessionFromCookie(state) {
      // Do nothing since the saga fetches the cookie then calls setEncryptedSession
    }
  },
});

export const { actions: appGlobalActions, reducer } = slice;

export const useAppGlobalStateSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: saga });
  useInjectSaga({
    key: slice.name + 'initSessionFromCookie',
    saga: sagaInitSessionFromCookie,
  });
  useInjectSaga({
    key: slice.name + 'sagaClearSession',
    saga: sagaClearSession,
  });
  return { actions: slice.actions };
};
