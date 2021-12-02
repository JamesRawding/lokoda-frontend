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

  .cta{
    font-weight:bold;
    border-style: solid;
    border-width: rem(2);
    border-radius: $border-radius-reg;
    padding: rem(11) rem(28);
    font-size: inherit;

    @media(min-width:$desktop){
      padding:rem(12) rem(32);
    }

    &--primary{
      border-color: $primary;
      background-color: $primary;
      color:$copy;

      
      @media(min-width:$desktop){
        &:hover{
          border-color: $dark-green;
          background-color: $dark-green;
          color:#fff;
        }
      }
    }

    &--secondary{
      border-color: $dark-green;
      background-color: transparent;
      color:$dark-green;

      @media(min-width:$desktop){
        &:hover{
          border-color: $dark-green;
          background-color: $dark-green;
          color:#fff;
        }
      }

      
    }
  }
</style>