<template>
<div class="input-container" v-if="isRequired">
  <label :for="inputId">
    <slot name="label"></slot>
    <span>(required)</span>
  </label>
  <span class="input-helper-text"><slot name="helpertext"></slot></span>
  <input 
    :value="modelValue" 
    @input="$emit('update:modelValue', $event.target.value)" 
    :type="type" 
    :id="inputId" 
    autocomplete="on"
    required>
    <base-icon-button v-if="type === 'password'" @click="showPassword" buttonType="button" mode="icon-button icon-button--show-password" ariaLabel="show password"></base-icon-button>
    <base-icon-button v-else @click="showPassword" buttonType="button" mode="icon-button icon-button--hide-password" ariaLabel="hide password"></base-icon-button>

</div>
<div class="input-container" v-else>
  <label :for="inputId">
    <slot name="label"></slot>
  </label>
  <span class="input-helper-text"><slot name="helpertext"></slot></span>
  <input 
    :value="modelValue" 
    @input="$emit('update:modelValue', $event.target.value)" 
    :type="type" 
    :id="inputId"
    autocomplete="on">
    
    <base-icon-button v-if="type === 'password'" @click="showPassword" buttonType="button" mode="icon-button icon-button--show-password" ariaLabel="show password"></base-icon-button>
    <base-icon-button v-else @click="showPassword" buttonType="button" mode="icon-button icon-button--hide-password" ariaLabel="hide password"></base-icon-button>


</div>
  
</template>

<script>
import BaseIconButton from '../UI/BaseIconButton.vue';

export default {
  components:{
    BaseIconButton
  },
  props: ['inputId', 'isRequired','modelValue'],
  data(){
    return {
      type:'password',
      btnText:'',
    }
  },
  methods: {
     showPassword() {
       if(this.type === 'password') {
          this.type = 'text'
          this.btnText = 'Hide Password'
       } else {
          this.type = 'password'
          this.btnText = 'Show Password'
       }
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
  }


  .icon-button{
    position: absolute;
    bottom:0;
    right: 0;
    color: $copy;

    @media(min-width:$desktop){
      bottom: rem(4);
    }

    &--show-password{
      background-color: transparent;
      &:before{
        content:'\f06e';
        font-size: rem(25);
      }
    }

    &--hide-password{
      background-color: transparent;
      &:before{
        content:'\f070';
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