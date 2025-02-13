import { createApp } from 'vue'
import urql, { cacheExchange, fetchExchange } from '@urql/vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from './App.vue'
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

console.log('process.env.VUE_APP_GRAPHQL_URL: ', process.env.VUE_APP_GRAPHQL_URL);

app.use(urql, {
    // TODO: env vars
    url: process.env.VUE_APP_GRAPHQL_URL,
    exchanges: [cacheExchange, fetchExchange],
  });

app.use(PrimeVue, {
  // Default theme configuration
  theme: {
      preset: Aura,
      options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
      }
  }
});

app.mount('#app');