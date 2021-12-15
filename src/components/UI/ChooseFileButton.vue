<template>
  <div>
    <label :for="fileUploadID">
      <slot></slot>
    </label>
    <input :class="mode" type="file" :id="fileUploadID" :name="fileUploadName">
  </div> 
</template>

<script>
export default {
  props: ['mode', 'fileUploadID', 'fileUploadName']
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

    &:before{
      font-family: "Font Awesome 5 Pro";
      font-weight: 300;
      content:'\f093';
      margin-right: $spacing-xs;
      width: rem(25);
      text-align: center;

      @media(min-width:$desktop){
        margin-right: $spacing-s;
      }
    }
  }

  dialog label{
    margin-top:$spacing-s;
  }
</style>