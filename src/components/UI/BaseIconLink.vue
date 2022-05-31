<template>
  <router-link :class="mode" :to="path">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: ['mode', 'path']
}
</script>

<style lang="scss" scoped>
  .icon-link{
    width:rem(44);
    height: rem(44);
    border: none;
    background-color:#fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $copy;
    position: relative;
    text-indent: -100000px;
    text-decoration: none;

    // &:before{
    //   font-family: "Font Awesome 5 Pro";
    //   font-weight: 300;
    //   text-align: center;
    //   text-indent: 0;  
    // }


    &--round{
      border-radius:100%;
      box-shadow: $box-shadow;

      @media(min-width:$desktop){
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
    }

   

    // &--spotify:before{
    //   content: '\f179';
    //   font-size: rem(20);
    // }

    // &--soundcloud:before{
    //   content: '\f060';
    //   font-size: rem(20);
    // }

    // &--bandcamp:before{
    //   content: '\f060';
    //   font-size: rem(20);
    // }

    // &--deezer:before{
    //   content: '\f060';
    //   font-size: rem(20);
    // }

    // &--tiktok:before{
    //   content: '\f060';
    //   font-size: rem(20);
    // }

    // &--instagram:before{
    //   content: '\f060';
    //   font-size: rem(20);
    // }

    // &--twitter:before{
    //   content: '\f060';
    //   font-size: rem(20);
    // }

    // &--facebook:before{
    //   content: '\f060';
    //   font-size: rem(20);
    // }
  }
</style>