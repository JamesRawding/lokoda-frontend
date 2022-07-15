<template>
  <nav>
    <div v-if="$store.state.loggedIn">
      <router-link class="header-link header-link--profile" :to="'/profile/'+this.$store.state.userID"><span class="sr-only">user profile</span></router-link>
      <router-link class="header-link header-link--discover" to="/"><span class="header-link__text">Discover</span></router-link>
      <router-link v-if="$store.state.messagesUnread < 1" class="header-link header-link--messages" to="/messages"><span class="header-link__text">Messages</span></router-link>
      <router-link v-else class="header-link header-link--message" to="/messages"><span class="header-link__message-count">{{$store.state.messagesUnread}}</span><span class="header-link__text">Messages</span></router-link>
    </div>
    <div v-else>
      <!-- <router-link class="header-link header-link--home" to="/login"><span class="header-link__text">log in</span></router-link> -->
      <router-link class="header-link header-link--discover" to="/"><span class="header-link__text">Discover</span></router-link>
      <router-link class="header-link header-link--login" to="/login"><span class="header-link__text">Log In</span></router-link>
    </div>
  </nav>
</template>
 

<style lang="scss" scoped>
  nav{
    box-shadow: $box-shadow;
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    background-color: $mid-grey;
    padding:$spacing-xs;
    z-index: 1;

    @media(min-width:$desktop){
      position: relative;
      box-shadow: none;
      background-color: #fff;
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
    position: relative;

    @media(min-width:$desktop){
      text-indent: 0;
      width: auto;
      margin-left: $spacing-l;
    }
    
    &:before{
      text-indent: 0;
      font-family: "Font Awesome 5 Pro";
      font-weight: 300;
      color: $copy;
      left: auto;
      position: absolute;
      color: #fff;

      @media(min-width:$desktop){
        margin-right: $spacing-s;
        position: relative;
        color: $copy;
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
      &:before{
        content: '\f2b9';
        font-size: rem(30);
      }
    }

    &--login{
      &:before{
        content: '\f2f6';
        font-size: rem(30);
      }
    }

    &--profile{
      &:before{
        content: '\f007';
        font-size: rem(30);
      }

      @media(min-width:$desktop){
        display: none;
      }
    }

    &--message{
      position: relative;
      &:before{
        content: '\f27a';
        font-size: rem(30);
      }

      .header-link__message-count{
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
          left: rem(18);
        }
      }
    }

    &--messages{
      &:before{
        content: '\f4b6';
        font-size: rem(30);
      }
    }

    &__text{
      position: relative;
      &:after{
        content: '';
        position: absolute;
        left:0;
        right:0;
        bottom: rem(-4);
        height: rem(2);
        background-color: transparent;
        border-radius: $border-radius-reg;
        transition: .25s background-color ease-in-out;
      }

      &:hover:after{
        background-color: $dark-green;
      }
    } 
  }

  .router-link-active{
    .header-link__text:after{
        background-color: $dark-green;
      }
    }
  

</style>