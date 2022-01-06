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
        padding-left: rem(4);
      }
    }

    &--trash:before{
      content: '\f2ed';
      font-size: rem(20);
    }

    &--send:before{
      content: '\f1d8';
      font-size: rem(20);
    }

    &--back:before{
      content: '\f060';
      font-size: rem(20);
    }
  }
</style>