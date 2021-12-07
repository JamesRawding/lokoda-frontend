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
    justify-content: center;
    font-size: inherit;
    color: $copy;
    height: rem(44);

    &:before{
      font-family: "Font Awesome 5 Pro";
      font-weight: 300;
      margin-right: $spacing-xs;

      @media(min-width:$desktop){
        margin-right: $spacing-s;
      }
    }

    @media(min-width:$desktop){
      &:hover{
        box-shadow: $box-shadow;
      }
    }

    &--filter{
      &:before{
        content:'\f0b0';
      }
    }
  }
</style>