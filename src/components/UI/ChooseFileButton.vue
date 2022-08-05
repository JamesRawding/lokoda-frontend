<template>
  <div>
    <label :for="fileUploadID">
      <slot></slot>
    </label>
    <input @input="$emit('update:modelValue', $event.target.value)" :class="mode" accept="image/png, image/jpeg" type="file" :id="fileUploadID" :name="fileUploadName">
  </div> 
</template>

<script>
export default {
  props: ['mode', 'fileUploadID', 'fileUploadName', 'modelValue']
}
</script>

<style lang="scss" scoped>
  input[type="file"] {
    display: none;
  }

  label{
    border: none;
    background-color:transparent;
    display: flex;
    align-items: center;
    font-size: inherit;
    color: $copy;
    height: rem(44);
    cursor: pointer;
    transition: all .25s ease-in-out;

    &:before{
      font-family: "Font Awesome 5 Pro";
      font-weight: 300;
      content:'\f093';
      margin-right: $spacing-xs;
      width: rem(25);
      text-align: center;

      // @media(min-width:$desktop){
      //   margin-right: $spacing-s;
      // }
    }
  }

  dialog label{
    margin-top:$spacing-s;
    @media(min-width:$desktop){
      width: calc(100% + 4rem);
      margin-left: -2rem;
      margin-right: -2rem;
      padding-left: 2rem;
      padding-right: 2rem;
      &:hover{
        background-color: $lightergrey;
      }
    }
  }
</style>