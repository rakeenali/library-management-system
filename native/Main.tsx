import React from 'react';

import UnAuthenticatedApp from './UnAuthenticated';
import AuthenticatedApp from './AuthenticatedApp';

import Loader from './app/components/Loader';
import { useUserState } from './app/context/User';

const Main = (): JSX.Element => {
  const userState = useUserState();

  if (userState.authState === 'USER') {
    return <AuthenticatedApp />;
  } else if (userState.authState === 'ANON') {
    return (
      <>
        <UnAuthenticatedApp />
      </>
    );
  }

  return <Loader />;
};

export default Main;
