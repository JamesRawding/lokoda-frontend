<template>
<div v-if="isRequired">
  <label :for="dropdownId">
    <slot name="label"></slot>
    <span>(required)</span>
  </label>
  <span class="input-helper-text"><slot name="helpertext"></slot></span>
  <select 
    :value="modelValue" 
    @change="onChange($event)" 
    :id="dropdownId" 
    aria-required="true" 
    required
    :disabled="isDisabled">
    <slot name="options"></slot>
  </select>
</div>
<div v-else>
  <label :for="dropdownId">
    <slot name="label"></slot>
  </label>
  <span class="input-helper-text"><slot name="helpertext"></slot></span>
  <select 
    :value="modelValue" 
    @change="onChange($event)" 
    :id="dropdownId"
    :disabled="isDisabled">
    <slot name="options"></slot>
    </select>
</div>
  
</template>

<script>
export default {
  emits:['changed'],
  props: ['dropdownId', 'isRequired','modelValue', 'isDisabled'],
  methods: {
    onChange(event) {
      this.$emit('changed',event.target.value)
    }
  }
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

  select{
    @include baseInput;
    appearance: none;
    background-image: url("../../assets/images/chevron-down.png");
    background-repeat: no-repeat;
    background-position: 98% 15px;
    cursor: pointer;
    background-size: 20px;
    color: $copy;

    ::-ms-expand {
      display: none; /* Hide the default arrow in Internet Explorer 10 and Internet Explorer 11 */
    }

    @media(min-width:$desktop){
      background-position: 95% 15px;
      background-position-y:19px;
    }
  }

  .dark{
    label,span{
      color: #fff;
    }
  }
</style>