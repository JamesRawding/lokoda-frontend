<template>
  <div v-if="avatarURL" class="profile-image">
    <img :src="avatarURL" :alt="this.$store.state.profile.profileName + 'profile image'">
  </div>
  <div v-else class="profile-image profile-image--fallback"></div>
</template>

<script>

export default {
  data(){
    return {
      avatarURL: this.$store.state.profile.profileAvatarURL,
    }
  },
}
</script>

<style lang="scss" scoped>

  .profile-image{
    border-radius: 100%;
    overflow: hidden;
    text-indent: 0;
    width:100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &--fallback{
      background-color:$dark-green;
      color:#fff;

      &:before{
        font-family: "Font Awesome 5 Pro";
        content:'\f007';
        font-weight: 300;
      }
    }

  }

  
</style>