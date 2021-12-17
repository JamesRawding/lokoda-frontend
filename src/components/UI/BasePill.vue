<template>
  <span class="pill">
    <slot></slot>
  </span>
</template>

<style lang="scss" scoped>
  span {
    background-color: $mid-grey;
    color: #fff;
    border-radius: 20px;
    padding: $spacing-xxxs $spacing-xs;
    font-size:$copy-mobile-xs;

    @media(min-width:$desktop){
      font-size:$copy-desktop-xs;
    }
  }

  .pill{
    margin-top:$spacing-s;
    margin-right: $spacing-xs;
    display: inline-block;
    width: auto;
  }
</style>