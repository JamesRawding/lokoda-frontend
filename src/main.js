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
      loggedIn: false,
      userID: '',
      messagesUnread: 2,
      newContact: {
        contactID: '',
        contactName: '',
        contactProfilePic: '',
        contactBlocked: false
      },
      profiles:[],
      profile:{
        profileType:'',
        profileURL: '/profile/a8d6e035-ab80-11ec-a1d7-c8bcc88ea0d9',
        profileImageURL: '',
        profileName: '',
        profileLocation: '',
        profileGenres: [],
        profileShows: [],
        profilePlayerEmbed: '',
        profileAvatarURL:'',
        profileEmail:'',
        profileMessages:[],
        profileContacts:[],
        profilePassword:'',
      },
    };
  },
  mutations:{
    login(state){
      state.loggedIn = true;
    },
    loggedIn(state){

      function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
      
      function checkCookie() {
        let user = getCookie("loggedIn");
        if (user != "") {
          //alert("Welcome again " + user);
          state.loggedIn = true;
        } else {
          state.loggedIn = false;
        }
      }

      checkCookie();
    },
    
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
    },
    setHeroImage(state, payload){
      state.profile.profileImageURL = payload;
    },
    setAvatarImage(state, payload){
      state.profile.profileAvatarURL = payload;
    },
    setNewProfileName(state, payload){
      state.profile.profileName = payload;
    },
    setNewProfileLocation(state, payload){
      state.profile.profileLocation = payload;
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
