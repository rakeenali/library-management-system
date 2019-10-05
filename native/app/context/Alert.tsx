// λ npx localtunnel --port 5000
import React from 'react';

import { Dispatch, ContextProps } from '../types';
import { Alert } from 'react-native';

interface ISTATE {
  showAlert: boolean;
  message: string;
}

type Action = { type: 'SHOW_ALERT'; payload: string } | { type: 'HIDE_ALERT' };

const AlertState = React.createContext<undefined | ISTATE>(undefined);
const AlertDispatch = React.createContext<undefined | Dispatch<Action>>(
  undefined
);

const alertReducer = (state: ISTATE, action: Action) => {
  switch (action.type) {
    case 'SHOW_ALERT': {
      return { ...state, showAlert: true, message: action.payload };
    }
    case 'HIDE_ALERT': {
      return { ...state, showAlert: false, message: '' };
    }
    default:
      throw new Error(`Invalid action ${action}`);
  }
};

const INITIAL_STATE: ISTATE = {
  message: '',
  showAlert: false
};

export const AlertProvider = ({ children }: ContextProps) => {
  const [state, dispatch] = React.useReducer(alertReducer, INITIAL_STATE);

  React.useEffect(() => {
    if (state.showAlert) {
      Alert.alert('Notification', state.message, [
        {
          text: 'Ok',
          onPress: () => {
            dispatch({ type: 'HIDE_ALERT' });
          }
        }
      ]);
    }
  }, [state.showAlert]);

  return (
    <AlertState.Provider value={state}>
      <AlertDispatch.Provider value={dispatch}>
        {children}
      </AlertDispatch.Provider>
    </AlertState.Provider>
  );
};

export const useAlertState = (): ISTATE => {
  const Context = React.useContext(AlertState);

  if (!Context) {
    throw new Error('useAlertState must be used inside AlertProvider');
  }
  return Context;
};

export const useAlertDispatch = (): Dispatch<Action> => {
  const Context = React.useContext(AlertDispatch);

  if (!Context) {
    throw new Error('useAlertDispatch must be used inside AlertProvider');
  }
  return Context;
};
