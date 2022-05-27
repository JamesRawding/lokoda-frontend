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
    @include cta;

    &--primary{
      @include cta--primary;
    }

    &--secondary{
      @include cta--secondary; 
    }

     &--secondary-reverse{
      @include cta--secondary-reverse; 
    }

    &--warning{
      @include cta--warning; 
    }
  }

  button:disabled,
  button[disabled]{
    opacity: .5;

    &:focus,
    &:hover{
      border-color: $primary;
      background-color: $primary;
      color: $copy;
    }
  }
</style>