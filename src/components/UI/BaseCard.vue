<template>
  <div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  div {
    box-shadow:$box-shadow;
    padding:$spacing-s;
    background-color: #fff;

    @media(min-width:$desktop){
      padding:$spacing-m;
    }
  }
</style>