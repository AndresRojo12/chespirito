import { useAuth } from '@/store/auth';

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuth();

  if (!authStore.isAuthenticated) {
    if (process.client) {
      return navigateTo('/auth-required');
    }
  }
});
