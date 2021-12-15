import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vClickOutside from 'click-outside-vue3'
import { FocusTrap } from 'focus-trap-vue'


const app = createApp(App)

app.component('FocusTrap', FocusTrap)
app.use(router)
app.use(vClickOutside)

router.isReady().then(function(){
  app.mount('#app')
})
