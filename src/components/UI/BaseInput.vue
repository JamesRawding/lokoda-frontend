<template>
<div v-if="isRequired">
  <label :for="inputId">
    <slot name="label"></slot>
    <span>(required)</span>
  </label>
  <span class="input-helper-text"><slot name="helpertext"></slot></span>
  <input 
    :value="modelValue" 
    @input="$emit('update:modelValue', $event.target.value)" 
    :type="inputType" 
    :id="inputId" 
    aria-required="true" 
    required>
</div>
<div v-else>
  <label :for="inputId">
    <slot name="label"></slot>
  </label>
  <span class="input-helper-text"><slot name="helpertext"></slot></span>
  <input 
    :value="modelValue" 
    @input="$emit('update:modelValue', $event.target.value)" 
    :type="inputType" 
    :id="inputId">
</div>
  
</template>

<script>
export default {
  props: ['inputType', 'inputId', 'isRequired','modelValue']
}
</script>

<style lang="scss" scoped>
  div{
    margin-top: $spacing-m;
  }

  label{
    @include baseLabel;
  }

  .input-helper-text{
    @include baseLabelHelper
  }

  input{
    @include baseInput;
  }

  .dark{
    label,span{
      color: #fff;
    }
  }
</style>