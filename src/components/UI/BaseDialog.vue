<template>
  <dialog 
  open>
    <div v-click-outside="clickToClose" class="dialog-inner">
      <slot></slot>
    </div>
  </dialog>
</template>

<script>
import vClickOutside from 'click-outside-vue3'
export default {
  emits:['closeDialog'],
  methods:{
    clickToClose(){
      this.$emit('closeDialog', true)
    },
  },
  directives: {
    clickOutside: vClickOutside.directive
  }
}

</script>

<style lang="scss" scoped>
  dialog{
    background-color: rgba(51,51,51,.85);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: none;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding:0;
    z-index: 1;

    @media(min-width:$desktop){
      position: absolute;
      background-color: #fff;
      border-radius:$border-radius-reg;
      box-shadow: $box-shadow;
      width:fit-content;
      margin:0;
      height: fit-content;
    }
  }

  .dialog-inner{
    background-color: #fff;
    width: 100%;
    padding: $spacing-s;
    color: $copy;

    @media(min-width:$desktop){
      padding: $spacing-m;
    }
  }
</style>