<template>
  <header>
    <!-- <router-link v-if="loggedIn" to="/profile"><img src="../../assets/images/lokoda-logo.svg" alt="lokoda logo"><span class="sr-only">user profile</span></router-link>
    <router-link v-else to="/"><img src="../../assets/images/lokoda-logo.svg" alt="lokoda logo"><span class="sr-only">Log in</span></router-link> -->
    <router-link v-if="$store.state.loggedIn" to="/profile"><img src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo_izjrxu.svg" alt="lokoda logo"><span class="sr-only">user profile</span></router-link>
    <router-link v-else to="/"><img src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo_izjrxu.svg" alt="lokoda logo"><span class="sr-only">Log in</span></router-link>
    <div class="header-nav-items">
      <header-nav></header-nav>
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
        <base-text-icon-link mode="text-icon-link text-icon-link--profile" path="/profile">View Profile</base-text-icon-link>
        <base-text-icon-link mode="text-icon-link text-icon-link--account" path="/account-settings">Account Settings</base-text-icon-link>
        <base-text-icon-button mode="text-icon-button text-icon-button--qr">Print QR Code</base-text-icon-button>
        <base-text-icon-button @click="logout" mode="text-icon-button text-icon-button--logout">Log Out</base-text-icon-button>
      </base-dialog>
    </transition>    
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
      this.isProfileDialogDisplayed = false
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  }
}
</script>

<style lang="scss" scoped>
  header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  a{
    display: contents;
  }

  img{
    max-width:rem(180);
    width:100%;
  }

  .header-nav-items{
    display: flex;
    align-items: center;
  }

  .profile-settings-button{
    border:none;
    width:rem(44);
    height:rem(44);
    //text-indent: -10000px;
    background-color: transparent;
    padding:0;
    display:flex;
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

</style>