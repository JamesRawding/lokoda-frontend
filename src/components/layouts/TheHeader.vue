<template>
  <header>
    <div class="header-inner">
    <div class="header-left">
      <router-link class="logo-link" v-if="$store.state.loggedIn" :to="'/profile/'+this.$store.state.userID"><img width="180" height="34" src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo_izjrxu.svg" alt="lokoda logo"><span class="sr-only">user profile</span></router-link>
      <router-link class="logo-link" v-else to="/"><img width="180" height="34" src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo_izjrxu.svg" alt="lokoda logo"><span class="sr-only">Discover</span></router-link>
      <router-link class="cta cta--primary" v-if="!$store.state.loggedIn" to="/registration">Register</router-link>
    </div>
    <div class="header-nav-items">
      <header-nav :navMessageCounter="unreadMessageCounter"></header-nav>
      <router-link class="cta cta--primary" v-if="!$store.state.loggedIn" to="/registration">Register</router-link>

      <button @click="showProfileDialog" class="profile-settings-button" aria-label="view profile settings" v-if="$store.state.loggedIn && isProfileDialogDisplayed">
       
        <profile-pic v-if="$store.state.loggedIn"></profile-pic>
      </button>
      <button  @click="showProfileDialog" v-click-outside="hideProfileDialog" class="profile-settings-button" aria-label="view profile settings" v-else-if="$store.state.loggedIn">
        <profile-pic v-if="$store.state.loggedIn"></profile-pic>
      </button>
    </div>

    
    <transition>
      <base-dialog  @closeDialog="hideProfileDialog" v-if="isProfileDialogDisplayed">
        <strong>Profile Options</strong>
        <base-text-icon-link mode="text-icon-link text-icon-link--profile" :path="'/profile/'+this.$store.state.userID">View Profile</base-text-icon-link>
        <base-text-icon-link mode="text-icon-link text-icon-link--account" path="/account-settings">Account Settings</base-text-icon-link>
        <!-- <base-text-icon-button mode="text-icon-button text-icon-button--qr">Print QR Code</base-text-icon-button> -->
        <base-text-icon-button @click="logout" mode="text-icon-button text-icon-button--logout">Log Out</base-text-icon-button>
      </base-dialog>
    </transition>  
    </div> 
  </header>
</template>

<script>
import vClickOutside from 'click-outside-vue3'
import HeaderNav from '../layouts/TheNav.vue';
import ProfilePic from '../UI/ProfilePic.vue';
import BaseDialog from '../UI/BaseDialog.vue';
import BaseTextIconButton from '../UI/BaseTextIconButton.vue';
import BaseTextIconLink from '../UI/BaseTextIconLink.vue';
 
export default {
  components:{
    HeaderNav,
    ProfilePic,
    BaseDialog,
    BaseTextIconButton,
    BaseTextIconLink
  },
  //emits:['loggedOut'],
  props:['unreadMessageCounter'],
  data(){
    return {
      isProfileDialogDisplayed: false,
    }
  },
  methods:{
    showProfileDialog(){
      this.isProfileDialogDisplayed = true
    },
    hideProfileDialog(){
      this.isProfileDialogDisplayed = false
    },
    logout(){
      this.$store.commit('logout');
      this.isProfileDialogDisplayed = false;
      this.$router.push('/');
    }
  },
  
  directives: {
    clickOutside: vClickOutside.directive
  }
}
</script>

<style lang="scss" scoped>
  header{
    box-shadow: $box-shadow;
    background-color: #fff;
  }

  .header-inner{
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    max-width: rem(1200);
    margin: 0 auto;
    padding: $spacing-s;

    @media(min-width:$desktop){
      padding:$spacing-s $spacing-m;
    }
  }

  .header-left{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width:100%;

    @media(min-width:$desktop){
      width:auto;
    }
    .cta--primary{
      @media(min-width:$desktop){
        display: none;
      }
    }
  }

  a{
    display: contents;
  }

  .logo-link{
    display: block;
  }

  img{
    display: block;
    max-width:rem(150);
    width:100%;

    @media(min-width:$desktop){
      max-width:rem(180);
    }
  }

  .header-nav-items{
    display: flex;
    align-items: center;

    .cta--primary{
      display: none;

      @media(min-width:$desktop){
        display: inline-block;
        margin-left:$spacing-m;
      }
    }
  }

  .profile-settings-button{
    border:none;
    width:rem(44);
    height:rem(44);
    //text-indent: -10000px;
    background-color: transparent;
    padding:0;
    display:flex;
    flex: 0 0 auto;
    margin-left:$spacing-l;
    font-size: rem(22); 
    position: relative;
    
    &:after{
      content:'';
      border-radius: 100%;
      border: rem(2) solid transparent;
      position: absolute;
      left: rem(-4);
      right: rem(-4);
      top: rem(-4);
      bottom: rem(-4);
      transition: .25s all ease-in-out;
    }

    &:hover:after{
      border-color: $dark-green;
    }
  }

  dialog{
    @media(min-width:$desktop){
      right: 0;
      left: auto;
      top: rem(60);
    }
  }

  a.cta--primary{
    @include cta;
    @include cta--primary;
    display:inline-block;
    text-decoration: none;
  }

</style>