import { defineStore } from 'pinia';
import {
  storeToken,
  getToken,
  removeToken,
  storeUser,
  getUser,
  removeUser,
} from '../util/token';

export const useAuth = defineStore('auth', {
  state: () => {
    return {
      isAuthenticated: !!getToken(),
      userId: null,
      user: getUser(),
      token: getToken(),
    };
  },

  actions: {
    login(token, user) {
      storeToken(token);
      storeUser(user);
      this.token = token;
      this.user = user;
      this.isAuthenticated = true;
      this.setUser(user);
      this.userId = user;
    },
    setUser(user) {
      this.userId = user;
      this.user = user;
    },
    logout() {
      removeToken();
      removeUser();
      this.isAuthenticated = false;
      this.userId = null;
      this.token = null;
      this.user = null;
    },
    loadUserFromStorage() {
      const token = getToken();
      const user = getUser();
      if (token && user) {
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
      }
    },
  },
});
