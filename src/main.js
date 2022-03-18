import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import router from './router';
import vClickOutside from 'click-outside-vue3';
import { FocusTrap } from 'focus-trap-vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

const store = createStore({
  state(){
    return {
      loggedIn: true,
      messagesUnread: 2,
      newContact: {
        contactID: '',
        contactName: '',
        contactProfilePic: '',
        contactBlocked: false
      }
    };
  },
  mutations:{
    logout(state){
      state.loggedIn = false;
    },
    messagesUnreadIncrement(state){
      state.messagesUnread += 1;
    },
    messagesUnreadDecrement(state){
      state.messagesUnread -=1;
    },
    createNewContact(state, payload){
      state.newContact.contactID = payload.contactID;
      state.newContact.contactName = payload.contactName;
      state.newContact.contactProfilePic = payload.contactProfilePic;
    },
    resetNewContact(state){
      state.newContact.contactID = '';
      state.newContact.contactName = '';
      state.newContact.contactProfilePic = '';
    }
  }
});
const app = createApp(App);
app.use(store);
app.component('FocusTrap', FocusTrap);
app.use(router);
app.use(vClickOutside);
app.use(VueAxios, axios);

router.isReady().then(function(){
  app.mount('#app')
}); 
