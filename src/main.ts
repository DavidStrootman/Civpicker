import {createApp} from 'vue'
import './style.css'
// @ts-ignore
import App from './App.vue'

import PrimeVue from 'primevue/config';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Button from "primevue/button";
import Tooltip from 'primevue/tooltip';


let app = createApp(App)

app.use(PrimeVue, {ripple: true});

app.component("Button", Button)
app.directive('tooltip', Tooltip);

app.mount('#app')
