<template>
  <header>
    <router-link v-if="loggedIn" to="/profile"><img src="../../assets/images/lokoda-logo.svg" alt="lokoda logo">user profile</router-link>
    <router-link v-else to="/"><img src="../../assets/images/lokoda-logo.svg" alt="lokoda logo">Log in</router-link>
    <div class="header-nav-items">
      <header-nav></header-nav>
      <button class="profile-settings-button" v-if="loggedIn">
        View profile settings
        <profile-pic v-if="loggedIn"></profile-pic>
      </button>
    </div>
    
  </header>
</template>

<script>
import HeaderNav from '../layouts/TheNav.vue';
import ProfilePic from '../UI/ProfilePic.vue';

export default {
  components:{
    HeaderNav,
    ProfilePic
  },
  data(){
    return {
      loggedIn: true,
    }
  },
}
</script>

<style lang="scss" scoped>
  header{
    display: flex;
    justify-content: space-between;
    align-items: center;
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

</style>