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

      &:hover{
        background-color: $dark-green;
        color:#fff;
      }
    }

    &--reverse{
      border-color: #fff;
      color: #fff;

      &:hover{
        background-color: #fff;
        color:$copy;
      }
    }
  }
</style>