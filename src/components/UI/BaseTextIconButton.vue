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
  .text-icon-button{
    border: none;
    background-color:transparent;
    display: flex;
    align-items: center;
    font-size: inherit;
    color: $copy;
    height: rem(44);
    

    &:before{
      font-family: "Font Awesome 5 Pro";
      font-weight: 300;
      margin-right: $spacing-xs;
      width: rem(25);
      text-align: center;
    }

    &--filter{
      &:before{
        content:'\f0b0';
      }
    }

    &--qr:before{
      content:'\f029'
    }

    &--logout:before{
      content:'\f2f5'
    }
    &--profile:before{
      content: '\f007';
    }

    &--photo:before{
      content: '\f302';
    }

    &--key:before{
      content: '\f084';
    }

    &--marker:before{
      content: '\f3c5';
    }

    &--tag:before{
      content: '\f02b';
    }

    &--trash:before{
      content: '\f2ed';
    }

    &--plus:before{
      content: '\f067';
    }

    &--list:before{
      content: '\f03a';
    }

     &--ellipsis:before{
      content: '\f141';
      font-size: rem(30);
    }

    &--new-message:before{
      content: '\f4a8';
    }

    &--back:before{
      content: '\f060';
      //font-size: rem(20);
    }

    &--block:before{
      content: '\f05e';
      //font-size: rem(20);
    }
  }

  dialog .text-icon-button{
   margin-top:$spacing-xs;

   @media(min-width:$desktop){
      margin-left: rem(-32);
      margin-right: rem(-32);
      padding-left: rem(32);
      padding-right: rem(32);
      width:calc(100% + 4rem);

      &:hover{
        background-color: $lightergrey;
      }
    }
  }

  .sidebar-nav .text-icon-button{
    @media(min-width:$desktop){
      margin-left: rem(-32);
      margin-right: rem(-32);
      padding-left: rem(32);
      padding-right: rem(32);
      width:calc(100% + 4rem);
      &:hover{
        background-color: $lightergrey;
      }
      &--active{
        color: #fff;
        background-color: $mid-grey;

        &:hover{
          color: $copy;
        }
      }

    }
  }
</style>