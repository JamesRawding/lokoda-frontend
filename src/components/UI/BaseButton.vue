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

    &--warning{
      @include cta--warning; 
    }
  }
</style>