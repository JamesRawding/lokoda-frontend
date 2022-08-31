<template>
<focus-trap>
  <dialog :class="mode" open>
    <div v-click-outside="clickToClose" class="dialog-inner">
      <base-icon-button mode="icon-button icon-button--close" ariaLabel="Close dialog" @click="clickToClose"></base-icon-button>
      <slot></slot>
    </div>
  </dialog>
  </focus-trap>
</template>

<script>
import vClickOutside from 'click-outside-vue3'
import BaseIconButton from '../UI/BaseIconButton.vue';

export default {
  props:['mode'],
  components:{
    BaseIconButton,
  },
  data(){
    return{
      dialogIsActive: true
    }
  },
  emits:['closeDialog'],
  methods:{
    clickToClose(){
      this.dialogIsActive = true;
      this.$emit('closeDialog', true)
    },
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  created() {
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
          return this.$emit('closeDialog', true)
      }
    });
  },
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
    position: relative;
    overflow: auto;

    @media(min-width:$desktop){
      padding: $spacing-m;
      min-width: rem(300);
    }
  }

  .modal-dialog{
    @media(min-width:$desktop){
      background-color: rgba(51,51,51,.85);
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border: none;
      border-radius: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding:0;
      z-index: 1;

      .dialog-inner{
        width: auto;
        max-width: rem(500);
        width: 100%;
        border-radius: $border-radius-reg;
      }

      &--warning{
        .dialog-inner{
          text-align: center;
        }
      }
    }
  }
  

  .icon-button--close{
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;

    &:focus{
      clip: unset;
      clip-path: unset;
      height: rem(44);
      width: rem(44);
      margin:0;
      right: 0;
      top:0;
    }
  }

  .modal-dialog--cookies{
    top: auto;
    height: auto;
    background-color: transparent;


    .dialog-inner{
      box-shadow: $box-shadow;
      background-color: $mid-grey;
      color:#fff;

      @media(min-width:$desktop){
        max-width: none;
        border-radius: 0;
        display: flex;
      }
    }
  }

  .modal-dialog--cookies .icon-button,
  .modal-dialog--manage-cookies .icon-button{
    display: none;
  }
  
  
</style>