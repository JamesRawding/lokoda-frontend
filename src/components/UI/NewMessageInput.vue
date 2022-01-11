<template>
<form @submit.prevent="submitNewMessage" class="new-message-input">
  <input 
    v-model="newMessage" 
    type="text" 
    :aria-label="ariaLabel"
    :id="inputId"
    placeholder="New Message">
    <base-icon-button  buttonType="submit" mode="icon-button icon-button--send" ariaLabel="send message"></base-icon-button>
</form>
  
</template>

<script>
import BaseIconButton from '../UI/BaseIconButton.vue';

export default {
  components:{
    BaseIconButton,
  },
  emits:['sendNewMessage'],
  props:['inputId', 'ariaLabel'],
  data(){
    return {
      newMessage: ''
    }
  },
  methods:{
    submitNewMessage(){
      this.$emit('sendNewMessage',this.newMessage);
      this.newMessage = '';
    }
  }
  
}
</script>

<style lang="scss" scoped>

.new-message-input{
  position: relative;
}
  
  input{
    @include baseInput;
    margin-top:0;
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
    background-color: transparent;

    @media(min-width:$desktop){
      bottom: rem(4);
    }    
  }

</style>