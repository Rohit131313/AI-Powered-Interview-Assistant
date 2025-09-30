import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import resumeReducer from './slices/resumeSlice';
import chatReducer from './slices/chatSlice';

const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
  resume: resumeReducer,
  chat: chatReducer,
});

// Persist only safe-to-serialize parts. DO NOT persist File objects.
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'ui', 'chat','resume'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default { store, persistor };
