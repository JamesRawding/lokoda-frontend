<template>
<div>
  <label :for="searchId">
    <slot name="label"></slot>
  </label>
  <span class="input-helper-text"><slot name="helpertext"></slot></span>
  <input 
    @keyup.enter="onEnter" 
    type="search" 
    :id="searchId"
    v-model="searchValue"
    :placeholder="searchPlaceholder">
    
    <base-icon-button @click="onClick"  buttonType="button" mode="icon-button icon-button--search">Submit search</base-icon-button>


</div>
  
</template>

<script>
import BaseIconButton from '../UI/BaseIconButton.vue';

export default {
  components:{
    BaseIconButton
  },
  emits:['searched'],
  props: ['searchId','searchPlaceholder'],
  data(){
    return{
      searchValue:''
    }
  },
  methods: {
    onEnter() {
      this.$emit('searched',this.searchValue);
    },
    onClick() {
      this.$emit('searched',this.searchValue);
    }
  }
}
</script>

<style lang="scss" scoped>
  div{
    margin-top: $spacing-m;
    position: relative;
  }

  label{
    @include baseLabel;
  }

  .input-helper-text{
    @include baseLabelHelper
  }

  input{
    @include baseInput;
    padding-right: rem(44);

    @media(min-width:$desktop){
      padding-right: rem(50);
    }

    &::-webkit-search-cancel-button{
      -webkit-appearance: none;
    }

    &::-ms-clear{
      display: none;
    }
  }


  .icon-button{
    position: absolute;
    bottom:0;
    right: 0;
    color: $copy;
    

    @media(min-width:$desktop){
      bottom: rem(4);
    }

    &--search{
      &:before{
        font-weight: 400;
        content:'\f002';
        font-size: rem(25);
      }
    }
    
  }

  .dark{
    label,span{
      color: #fff;
    }
  }

</style>