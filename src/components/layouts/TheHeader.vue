<template>
  <header>
    <router-link v-if="loggedIn" to="/profile"><img src="../../assets/images/lokoda-logo.svg" alt="lokoda logo">user profile</router-link>
    <router-link v-else to="/"><img src="../../assets/images/lokoda-logo.svg" alt="lokoda logo">Log in</router-link>
    <div class="header-nav-items">
      <header-nav></header-nav>
      <button @click="showProfileDialog" class="profile-settings-button" v-if="loggedIn && isProfileDialogDisplayed">
        View profile settings
        <profile-pic v-if="loggedIn"></profile-pic>
      </button>
      <button  @click="showProfileDialog" v-click-outside="hideProfileDialog" class="profile-settings-button" v-else-if="loggedIn">
        View profile settings
        <profile-pic v-if="loggedIn"></profile-pic>
      </button>
    </div>

    
    <transition name="fade" mode="out-in">
      <base-dialog  @closeDialog="hideProfileDialog" v-if="isProfileDialogDisplayed">
        <strong>Profile Options</strong>
        <router-link class="text-icon-link text-icon-link--account" to="/account">Account Details</router-link>
        <base-text-icon-button mode="text-icon-button text-icon-button--qr">Print QR Code</base-text-icon-button>
        <base-text-icon-button mode="text-icon-button text-icon-button--logout">Log Out</base-text-icon-button>
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

export default {
  components:{
    HeaderNav,
    ProfilePic,
    BaseDialog,
    BaseTextIconButton
  },
  data(){
    return {
      loggedIn: true,
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
    text-indent: -10000px;
  }

  img{
    max-width:rem(180);
    width:100%;
    float:left;
  }

  .header-nav-items{
    display: flex;
    align-items: center;
  }

  .profile-settings-button{
    border:none;
    width:rem(44);
    height:rem(44);
    text-indent: -10000px;
    background-color: transparent;
    padding:0;
    display:flex;
    margin-left:$spacing-l;
    font-size: rem(22);  
  }

  dialog{
    @media(min-width:$desktop){
      right: 0;
      left: auto;
      top: rem(60);
    }
  }

  .text-icon-link{
    text-decoration: none;
    color: inherit;
    display: flex;
    text-indent: 0;
    height:rem(44);
    align-items: center;
    margin-top: $spacing-s;

    &:before{
      font-family: "Font Awesome 5 Pro";
      font-weight: 300;
      margin-right: $spacing-xs;

      @media(min-width:$desktop){
        margin-right: $spacing-s;
      }
    }

  &--account:before{
    content: '\f013';
  }

  }

  .text-icon-button{
    margin-top:$spacing-xs;

    &--qr:before{
      content:'\f029'
    }

    &--logout:before{
      content:'\f2f5'
    }
  }

</style>