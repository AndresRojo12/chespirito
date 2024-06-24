import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createPinia } from 'pinia';

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
  });

  nuxtApp.vueApp.use(vuetify);
  nuxtApp.vueApp.use(pinia);
});
