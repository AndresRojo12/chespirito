import { defineStore } from 'pinia';
import { storeToken, getToken, removeToken } from '../util/token';

export const useAuth = defineStore('auth', {
  state: () => {
    return {
      isAuthenticated: !!getToken(),
      token: getToken(),
      loading: true,
    };
  },

  actions: {
    loadUserFromStorage() {
      const token = getToken();
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
        this.token = null;
      }
      this.loading = false;
    },
    login(token) {
      storeToken(token);
      this.token = token;
      this.isAuthenticated = true;
      this.loading = false;
    },
    logout() {
      removeToken();
      this.token = null;
      this.isAuthenticated = false;
      this.loading = false;
    },
  },
});
