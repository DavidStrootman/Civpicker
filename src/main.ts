import {createApp} from 'vue'
import { createPinia } from 'pinia'
import './style.css'
// @ts-ignore
import App from './App.vue'

import PrimeVue from 'primevue/config';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Button from "primevue/button";
import Tooltip from 'primevue/tooltip';



const app = createApp(App)
app.use(PrimeVue, {ripple: true});

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.component("Button", Button)
app.directive('tooltip', Tooltip);

app.mount('#app')
