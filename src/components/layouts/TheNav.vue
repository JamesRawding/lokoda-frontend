<template>
  <nav>
    <div v-if="loggedIn">
      <router-link class="header-link header-link--profile" to="/profile">user profile</router-link>
      <router-link class="header-link header-link--discover" to="/discover">Discover</router-link>
      <router-link v-if="messageCount < 1" class="header-link header-link--messages" to="/messages">Messages</router-link>
      <router-link v-else class="header-link header-link--message" to="/messages"><span>{{messageCount}}</span> Messages</router-link>
    </div>
    <div v-else>
      <router-link class="header-link header-link--home" to="/">log in</router-link>
      <router-link class="header-link header-link--discover" to="/discover">Discover</router-link>
    </div>
  </nav>
</template>

<script>

export default {
  data(){
    return {
      loggedIn: true,
      messageCount: 0
    }
  },
}
</script>

<style lang="scss" scoped>
  nav{
    box-shadow: $box-shadow;
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    background-color: #fff;
    padding:$spacing-xs;

    @media(min-width:$desktop){
      position: relative;
      box-shadow: none;
    }

    div{
      display: flex;
      justify-content: space-around;
    }
  }

  .header-link{
    text-indent: -10000px;
    display: flex;
    height: rem(44);
    width:rem(44);
    align-items: center;
    justify-content: center;
    color: $copy;
    text-decoration: none;

    @media(min-width:$desktop){
      text-indent: 0;
      width: auto;
      margin-left: $spacing-l;
    }
    
    &:before{
      text-indent: 0;
      font-family: "Font Awesome 5 Pro";
      font-weight: 300;

      @media(min-width:$desktop){
        margin-right: $spacing-s;
      }
    }

    &--home{
      @media(min-width:$desktop){
        display: none;
      }
      &:before{
        content:'\f015';
        font-size: rem(30);
      }
    }

    &--discover{
      &::before{
        content: '\f2b9';
        font-size: rem(30);
      }
    }

    &--profile{
      &::before{
        content: '\f007';
        font-size: rem(30);
      }

      @media(min-width:$desktop){
        display: none;
      }
    }

    &--message{
      position: relative;
      &::before{
        content: '\f27a';
        font-size: rem(30);
      }

      span{
        position: absolute;
        right: 0;
        top:0;
        text-indent: 0;
        background-color: $primary;
        border-radius: 100%;
        width:rem(24);
        height: rem(24);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: $copy-mobile-s;

        @media(min-width:$desktop){
          position: relative;
          order:2;
          margin-left: $spacing-xs;
        }
      }
    }

    &--messages{
      &::before{
        content: '\f4b6';
        font-size: rem(30);
      }
    }
  }

</style>