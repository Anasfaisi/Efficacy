// import React from "react";
// import { Provider } from "react-redux";
// import { store } from "./store";

// interface ProvidersProps{
//     children:React.ReactNode;
// }

// export function Providers({children}:ProvidersProps){
//     return <Provider store={store}>{children}</Provider>
// }

// Providers.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
