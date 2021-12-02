import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import BaseButton from './components/UI/BaseButton.vue';
import BaseIconButton from './components/UI/BaseIconButton.vue';
import BasePillButton from './components/UI/BasePillButton.vue';

const app = createApp(App)

app.component('base-button', BaseButton);
app.component('base-icon-button', BaseIconButton);
app.component('base-pill-button', BasePillButton);

app.use(router).mount('#app')
