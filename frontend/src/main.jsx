import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from "./context/NotificationContext";
import 'remixicon/fonts/remixicon.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import WelcomeBackScreen from './components/WelcomeBackScreen';

const Root = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    try {
      const persistedRoot = JSON.parse(localStorage.getItem('persist:root') || '{}');
      const uiState = persistedRoot.ui ? JSON.parse(persistedRoot.ui) : {};
      
      // Show Welcome Back only if userChatPanel was active
      if (uiState.userChatPanel === true) {
        setShowSplash(true);
      }
    } catch (err) {
      console.error("Failed to read persisted state:", err);
    }
    setCheckedSession(true);
  }, []);

  if (!checkedSession) return null; // wait until session check is done

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {showSplash ? (
          <WelcomeBackScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <NotificationProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NotificationProvider>
        )}
      </PersistGate>
    </Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
