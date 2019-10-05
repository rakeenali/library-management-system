import React from 'react';

import Main from './Main';

import { AlertProvider } from './app/context/Alert';
import { UserProvider } from './app/context/User';

const App = () => {
  return (
    <AlertProvider>
      <UserProvider>
        <Main />
      </UserProvider>
    </AlertProvider>
  );
};

export default App;
