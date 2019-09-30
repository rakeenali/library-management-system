import { writable } from 'svelte/store';
import jwtDecode from 'jwt-decode';

const INITIAL_STATE = {
  token: '',
  isAdmin: false,
  email: ''
};

const admin = () => {
  const { subscribe, set, update } = writable(INITIAL_STATE);

  const logValues = () => {
    subscribe(value => {
      return console.log(value);
    });
  };

  const setAdmin = token => {
    const jsonObj = {
      token,
      admin: true
    };
    localStorage.setItem('lib-mgm', JSON.stringify(jsonObj));
    const decode = jwtDecode(token);
    return update(n => ({
      ...n,
      token,
      isAdmin: true,
      email: decode.identity
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
    setAdmin,
    logValues
  };
};

export const Admin = admin();
