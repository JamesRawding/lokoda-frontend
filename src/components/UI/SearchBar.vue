<template>
<div class="search-bar-container">
  <label :for="searchId">
    <slot name="label"></slot>
  </label>
  <span class="input-helper-text"><slot name="helpertext"></slot></span>
  <span class="search-icon"></span>
  <input 
    @keyup="onKeyup" 
    type="search" 
    :id="searchId"
    v-model="searchValue"
    :placeholder="searchPlaceholder"
    :aria-label="ariaLabel">    

</div>
  
</template>

<script>

export default {
  emits:['searched'],
  props: ['searchId','searchPlaceholder', 'ariaLabel'],
  data(){
    return{
      searchValue:''
    }
  },
  methods: {
    onKeyup() {
      this.$emit('searched',this.searchValue);
    },
    // onClick() {
    //   this.$emit('searched',this.searchValue);
    // }
  }
}
</script>

<style lang="scss" scoped>
  .search-bar-container{
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
    padding-left: rem(44);

    @media(min-width:$desktop){
      padding-left: rem(50);
    }

    &::-webkit-search-cancel-button{
      -webkit-appearance: none;
    }

    &::-ms-clear{
      display: none;
    }
  }


  .search-icon{
    position: absolute;
    bottom:rem(10);
    left: rem(8);
    color: $copy;
    background-color: transparent;

    @media(min-width:$desktop){
      bottom: rem(14);
      left: rem(16);
    }
    &:before{
      font-family: "Font Awesome 5 Pro";
      font-weight: 400;
      content:'\f002';
      font-size: rem(20);
    }
    
  }

  .dark{
    label,span{
      color: #fff;
    }
  }

</style>