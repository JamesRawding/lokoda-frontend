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

  .link-button{
    border: none;
    background-color: transparent;
    cursor: pointer;
    text-decoration: underline;
    text-decoration-thickness: rem(1);
    text-underline-offset: 0.1em;
    font-size: inherit;

    &:hover{
      text-decoration-thickness: rem(2);
    }
    &--default{
       color: $link;
    }

    &--reverse{
      color:#fff;
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