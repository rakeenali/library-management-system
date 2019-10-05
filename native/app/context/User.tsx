import React from 'react';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

import { api } from '../utils/getVars';
import { Dispatch, ContextProps, UserResponse, RentBook } from '../types';

interface ISTATE {
  token: string | null;
  isbns: string[] | null;
  rentBooks: RentBook[] | null;
  authState: 'USER' | 'LOADING' | 'ANON';
}

type Action =
  | { type: 'LOGIN'; payload: string }
  | { type: 'NO_USER' }
  | { type: 'SET_BOOKS'; payload: RentBook[] }
  | { type: 'SET_ISBNS'; payload: string[] }
  | { type: 'ADD_BOOK'; payload: RentBook }
  | { type: 'REMOVE_BOOK'; payload: string };

const UserState = React.createContext<ISTATE | undefined>(undefined);
const UserDispatch = React.createContext<Dispatch<Action> | undefined>(
  undefined
);

const INITIAL_STATE: ISTATE = {
  isbns: null,
  authState: 'LOADING',
  rentBooks: null,
  token: null
};

const userReducer = (state: ISTATE, action: Action): ISTATE => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        authState: 'USER',
        token: action.payload
      };
    }
    case 'NO_USER': {
      AsyncStorage.removeItem('user:token');
      return {
        ...INITIAL_STATE,
        authState: 'ANON'
      };
    }
    case 'SET_BOOKS': {
      return {
        ...state,
        rentBooks: action.payload
      };
    }
    case 'ADD_BOOK': {
      return {
        ...state,
        rentBooks: [...state.rentBooks, action.payload],
        isbns: [...state.isbns, action.payload.isbn]
      };
    }
    case 'REMOVE_BOOK': {
      return {
        ...state,
        rentBooks: [
          ...state.rentBooks.filter(({ isbn }) => isbn !== action.payload)
        ],
        isbns: [...state.isbns.filter(isbn => isbn !== action.payload)]
      };
    }
    case 'SET_ISBNS': {
      return {
        ...state,
        isbns: action.payload
      };
    }
    default: {
      throw new Error(`Action is not defined in user reducer ${action}`);
    }
  }
};

export const UserProvider = ({ children }: ContextProps) => {
  const [state, dispatch] = React.useReducer(userReducer, INITIAL_STATE);

  React.useLayoutEffect(() => {
    AsyncStorage.getItem('user:token')
      .then(res => {
        if (res) {
          setBooks(res, dispatch).then(() => {
            dispatch({ type: 'LOGIN', payload: res });
          });
          return;
        }
        dispatch({ type: 'NO_USER' });
      })
      .catch(err => {
        throw new Error(err.message);
      });
  }, []);

  return (
    <UserState.Provider value={state}>
      <UserDispatch.Provider value={dispatch}>{children}</UserDispatch.Provider>
    </UserState.Provider>
  );
};

export const useUserState = (): ISTATE => {
  const Context = React.useContext(UserState);

  if (!Context) {
    throw new Error('useUserState must be used inside UserProvider');
  }
  return Context;
};

export const useUserDispatch = (): Dispatch<Action> => {
  const Context = React.useContext(UserDispatch);

  if (!Context) {
    throw new Error('useUserDispatch must be used inside UserProvider');
  }
  return Context;
};

export const setBooks = async (token: string, dispatch: Dispatch<Action>) => {
  try {
    const res = (await axios.get(`${api}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })) as UserResponse;

    if (res && res.data) {
      dispatch({ type: 'SET_BOOKS', payload: res.data.books });

      const isbns = res.data.books.map(({ isbn }) => isbn);
      dispatch({ type: 'SET_ISBNS', payload: isbns });
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const setUserLogin = async (
  token: string,
  dispatch: Dispatch<Action>
) => {
  try {
    await AsyncStorage.setItem('user:token', token);
    setBooks(token, dispatch);
    dispatch({ type: 'LOGIN', payload: token });
    return;
  } catch (err) {
    throw new Error(err.message);
  }
};
