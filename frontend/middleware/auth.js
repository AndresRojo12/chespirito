import { useAuth } from '@/store/auth';

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuth();

  if (!authStore.isAuthenticated) {
    setTimeout(() => {
      return navigateTo('/auth-required');
    }, 1000);
  }
});
