<template>
  <div class="card" :class="mode">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props:['mode']
}
</script>

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