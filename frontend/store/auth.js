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
      user: getUser(),
      token: getToken(),
      loading: true,
    };
  },

  actions: {
    loadUserFromStorage() {
      const token = getToken();
      const user = getUser();
      if (token && user) {
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
        this.token = null;
        this.user = null;
      }
      this.loading = false;
    },
    login(token, user) {
      storeToken(token);
      storeUser(user);
      this.token = token;
      this.user = user;
      this.isAuthenticated = true;
      this.loading = false;
    },
    logout() {
      removeToken();
      removeUser();
      this.isAuthenticated = false;
      this.token = null;
      this.user = null;
      this.loading = false;
    },
  },
});
