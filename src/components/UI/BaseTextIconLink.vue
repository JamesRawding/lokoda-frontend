<template>
  <router-link :class="mode" :to="path">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: ['mode', 'path']
}
</script>

<style lang="scss" scoped>
  .text-icon-link{
    text-decoration: none;
    color: inherit;
    display: flex;
    text-indent: 0;
    height:rem(44);
    align-items: center;
    transition: .25s background-color ease-in-out;

    &:before{
      font-family: "Font Awesome 5 Pro";
      font-weight: 300;
      margin-right: $spacing-xs;
      width: rem(25);
      text-align: center;

      @media(min-width:$desktop){
        margin-right: $spacing-s;
      }
    }

    &--account:before{
      content: '\f013';
    }

    &--profile:before{
      content: '\f007';
    }

    &--chat:before{
      content: '\f075';
    }

    
  }

  dialog .text-icon-link{
    margin-top: $spacing-xs;

    &:first-of-type{
      margin-top:$spacing-s;
    }

    @media(min-width:$desktop){
      margin-left: rem(-32);
      margin-right: rem(-32);
      padding-left: rem(32);
      padding-right: rem(32);

      &:hover{
        background-color: $lightgrey;
      }
    }
  }
</style>