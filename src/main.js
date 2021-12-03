import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import BaseButton from './components/UI/BaseButton.vue';
import BaseIconButton from './components/UI/BaseIconButton.vue';

const app = createApp(App)

app.component('base-button', BaseButton);
app.component('base-icon-button', BaseIconButton);

app.use(router)

router.isReady().then(function(){
  app.mount('#app')
})
