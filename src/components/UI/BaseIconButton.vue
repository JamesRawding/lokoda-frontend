<template>
  <button :class="mode" :type="buttonType">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['mode', 'buttonType']
}
</script>

<style lang="scss" scoped>
  .icon-button{
    width:rem(44);
    height: rem(44);
    border: none;
    background-color:#fff;
    text-indent: -10000px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:before{
      text-indent: 0;
      font-family: "Font Awesome 5 Pro";
      font-weight: 300;
      text-align: center;
    }

    @media(min-width:$desktop){
      &:hover{
        box-shadow: $box-shadow;
      }
    }

    &--round{
      border-radius:100%;
    }

    &--new-message{
      &:before{
        content:'\f4a8';
        font-size: rem(30);
      }
    }

    &--ellipsis{
      &:before{
        content:'\f141';
        font-size: rem(30);
      }
    }

     &--user{
      &:before{
        content:'\f007';
        font-size: rem(30);
      }
    }

    &--close{
      &:before{
        content:'\f00d';
        font-size: rem(30);
      }
    }

    &--edit{
      &:before{
        content:'\f044';
        font-size: rem(18);
        padding-left: rem(3);
      }
    }
  }
</style>