<template>
<div class="input-container" v-if="isRequired">
  <label :for="inputId">
    <slot name="label"></slot>
    <span>(required)</span>
  </label>
  <span class="input-helper-text"><slot name="helpertext"></slot></span>
  <textarea 
    :value="modelValue" 
    @input="$emit('update:modelValue', $event.target.value)" 
    :id="inputId"
    :aria-label="ariaLabel"
    :pattern="inputPattern"
    :inputmode="inputMode" 
    aria-required="true" 
    required>
  </textarea>
</div>
<div class="input-container" v-else>
  <label :for="inputId">
    <slot name="label"></slot>
  </label>
  <span class="input-helper-text"><slot name="helpertext"></slot></span>
  <textarea 
    :value="modelValue" 
    @input="$emit('update:modelValue', $event.target.value)" 
    :id="inputId"
    :aria-label="ariaLabel"
    :pattern="inputPattern"
    :inputmode="inputMode">
  </textarea>
</div>
  
</template>

<script>
export default {
  props: ['inputType', 'inputId', 'isRequired', 'inputPattern' , 'inputMode' ,'modelValue', 'ariaLabel']
}
</script>

<style lang="scss" scoped>
  .input-container{
    margin-top: $spacing-m;
  }

  label{
    @include baseLabel;
  }

  .input-helper-text{
    @include baseLabelHelper
  }

  textarea{
    @include baseTextarea;
  }

  .dark{
    label,span{
      color: #fff;
    }
  }

  // dialog .input-container:first-of-type{
  //   margin-top: 0;
  // }

  .add-show-date-fields label span{
    display: none;
  }
</style>