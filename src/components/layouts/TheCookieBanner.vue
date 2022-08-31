<template>
  <transition>
    <base-dialog
      v-if="bannerActive"
      mode="modal-dialog modal-dialog--cookies"
    >

    <p>By clicking “Accept”, you agree to the storing of cookies on your device from Spotify and Soundcloud.</p>
    <div class="modal-dialog__cta-container">
      <base-button mode="cta cta--secondary-reverse" @click="manageCookies" @keypress.enter="manageCookies">Manage</base-button>
      <base-button mode="cta cta--primary" @click="acceptCookies" @keypress.enter="acceptCookies">Accept</base-button>
    </div>
      
    </base-dialog>
  </transition>

  <transition>
    <base-dialog
      v-if="manageCookiesActive"
      mode="modal-dialog modal-dialog--manage-cookies"
    >

    <div class="modal-dialog--manage-cookies__intro">
      <strong class="h2">Privacy Preference Center</strong>
      <p>When you visit any web site, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to. The information does not usually directly identify you, but it can give you a more personalized web experience.</p>
      <p>Because we respect your right to privacy, you can choose not to allow some types of cookies. Click on the different category headings to find out more and change our default settings. However, blocking some types of cookies may impact your experience of the site and the services we are able to offer.</p>
      <base-button mode="cta cta--primary" @click="acceptCookies" @keypress.enter="acceptCookies">Accept All</base-button>
    </div>

    
    <div class="modal-dialog--manage-cookies__list">
      <strong class="h3">Manage Cookies</strong>
      <p>Individual cookies can be switched on/off here.</p>
      <strong class="cookie-toggle-heading">Strictly Necessary</strong>
      <div class="cookie-toggle-container">
        
        <p>These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identifiable information.</p>
        <strong>Always Active</strong>
      </div>
    
      <strong class="cookie-toggle-heading">Third Party</strong>
      <div class="cookie-toggle-container">
        
        <p>To gain access to Artists Spotify/Souncloud embedded music players this cookie needs to be turned on</p>
        <base-pill-button
          :class="{'pill-button--selected': thirdPartyCookiesAccepted}" 
          mode="pill-button pill-button--default"
          @click="toggleCookie"
          >
          <span v-if="thirdPartyCookiesAccepted">Turn Off</span>
          <span v-else>Turn On</span>
        </base-pill-button>
      </div>
    </div>
    
    
    
    
    
    <div class="modal-dialog__cta-container">
      <base-button mode="cta cta--secondary" @click="cancelManageCookies" @keypress.enter="cancelManageCookies">Cancel</base-button>
      <base-button mode="cta cta--primary" @click="saveCookies" @keypress.enter="saveCookies">Save</base-button>
    </div>
      
    </base-dialog>
  </transition>
</template>

<script>
import BaseButton from '../UI/BaseButton.vue';
import BaseDialog from "../UI/BaseDialog.vue";
import BasePillButton from "../UI/BasePillButton.vue";


export default ({
  components:{
    BaseButton,
    BaseDialog,
    BasePillButton
  },
  data(){
    return {
      bannerActive: false,
      manageCookiesActive: false,
      thirdPartyCookiesAccepted: false,
    }
  },
  methods:{
    acceptCookies(){
      this.bannerActive = false;
      this.manageCookiesActive = false;
      function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays += 3600000*24*30));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }
      setCookie('cookiesAccepted',true, 2 );
      setCookie('thirdPartyAccepted',true, 2 );
      if (window.location.href.indexOf("profile") > -1) {
        window.location.reload()
      }
    },
    saveCookies(){
      this.bannerActive = false;
      this.manageCookiesActive = false;
      function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays += 3600000*24*30));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }
      if(this.thirdPartyCookiesAccepted){
        setCookie('cookiesAccepted',true, 2 );
        setCookie('thirdPartyAccepted',true, 2 );
      }else{
        setCookie('cookiesAccepted',true, 2 );
      }
      if (window.location.href.indexOf("profile") > -1) {
        window.location.reload() 
      }
      
      
    },
    getCookie(cname) {
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
    },
    checkCookie() {
     // console.log('here')
      let cookieAcceptedValue = this.getCookie("cookiesAccepted");
      let thirdPartyAcceptedValue = this.getCookie("thirdPartyAccepted");
      //console.log(cookieAcceptedValue)
      
      if (cookieAcceptedValue === 'true') {
        this.bannerActive = false;
        this.$store.commit("cookiesAcceptedState",true);
      } else {
        this.bannerActive = true;
        this.$store.commit("cookiesAcceptedState",false);
      }

      if (thirdPartyAcceptedValue === 'true') {
        this.$store.commit("thirdPartyAcceptedState",true);
      }else{
        this.$store.commit("thirdPartyAcceptedState",false);
      }

    },
     manageCookies(){
      this.bannerActive = false;
      this.manageCookiesActive = true;
    },
    cancelManageCookies(){
      this.manageCookiesActive = false;
      this.bannerActive = true;
    },
    toggleCookie(){

      if(this.thirdPartyCookiesAccepted){
        this.thirdPartyCookiesAccepted = false
      }else{
        this.thirdPartyCookiesAccepted = true;
      }
      
    }
  },
  mounted(){
    this.checkCookie();
  }
  
})
</script>


<style lang="scss" scoped>
  .modal-dialog__cta-container{
    margin-top: $spacing-m;

    @media(min-width:$desktop){
     flex:1 0 auto;
     margin-top: 0;
     margin-left: $spacing-m;
    }
  }

  .cta:first-of-type{
    margin-right: $spacing-s;
  }

  .modal-dialog--manage-cookies__intro{
    p{
      margin-top: $spacing-s;
    }

    .cta{
      margin-top:$spacing-m;
    }
  }

  .modal-dialog--manage-cookies__list{
    margin-top:$spacing-l;
  }

  .cookie-toggle-heading{
    margin-top:$spacing-m;
    display: block;
  }

  .cookie-toggle-container{
    display: flex;
    align-items: flex-start;

    p{
      flex: 0 1 auto;
    }

    strong:first-of-type{
      margin-left: $spacing-s;
      display: block;
      flex: 0 0 auto;
    }

    .pill-button{
      flex: 0 0 auto;
      margin-top: 0;
      margin-right: 0;
      margin-left: $spacing-s;
    }
  }

  .modal-dialog--manage-cookies{
    .modal-dialog__cta-container{
      margin-top:$spacing-m;
      margin-left: 0;
    }
  }
</style>