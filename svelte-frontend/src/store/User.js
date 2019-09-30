import { writable } from 'svelte/store';
import jwtDecode from 'jwt-decode';

const INITIAL_STATE = {
  token: '',
  isUser: false,
  username: '',
  books: []
};

const user = () => {
  const { subscribe, set, update } = writable(INITIAL_STATE);

  const logValues = () => {
    subscribe(value => {
      return console.log(value);
    });
  };

  const setUser = token => {
    const jsonObj = {
      token,
      user: true
    };
    localStorage.setItem('lib-mgm', JSON.stringify(jsonObj));
    const decode = jwtDecode(token);
    return update(n => ({
      ...n,
      token,
      isUser: true,
      username: decode.identity
    }));
  };

  const setBooks = books => {
    return update(n => ({
      ...n,
      books: [...n.books, ...books]
    }));
  };

  const removeBooks = removedisbn => {
    return update(n => ({
      ...n,
      books: n.books.filter(({ isbn }) => isbn !== removedisbn)
    }));
  };

  const logout = () => {
    localStorage.removeItem('lib-mgm');
    return update(() => ({
      ...INITIAL_STATE
    }));
  };

  return {
    logout,
    subscribe,
    setUser,
    logValues,
    setBooks,
    removeBooks
  };
};

export const User = user();
