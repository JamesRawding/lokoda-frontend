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
  .pill-button{
    border:rem(2) solid transparent;
    background-color: transparent;
    font-weight: bold;
    font-size: inherit;
    border-radius: rem(30);
    padding: rem(9) $spacing-s;

    @media(min-width:$desktop){
      padding: rem(9) rem(20);
    }


    &--default{
      border-color: $dark-green;
      color: $dark-green;

      @media(min-width:$desktop){
        &:hover{
          background-color: $dark-green;
          color:#fff;
        }
      }

      

      &.pill-button--selected{
        background-color: $dark-green;
        color:#fff;
      }
    }

    &--reverse{
      border-color: #fff;
      color: #fff;

      @media(min-width:$desktop){
        &:hover{
          background-color: #fff;
          color:$copy;
        }
      }
      

      &.pill-button--selected{
        background-color: #fff;
        color:$copy;
      }
    }

    .modal-dialog &{
      margin-right: $spacing-s;
      margin-top: $spacing-s;
    }
  }

  
</style>