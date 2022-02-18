<template>
<main>
    <img src="../assets/images/lokoda-logo-reverse.svg" alt="lokoda logo">
    <h1>Create New Password</h1>
    <p>Hopefully you remember it this time.</p>

    <form @submit.prevent="submitForm">
      <password-input class="dark" inputId="createPassword" v-model="password" :isRequired="true" >
        <template #label>Create Password</template>
        <template #helpertext>Must be at least 8 characters long.</template>
      </password-input>
      <password-input class="dark" inputId="confirmPassword" v-model="confirmPassword" :isRequired="true" >
        <template #label>Confirm Password</template>
      </password-input>
      <base-button buttonType="submit" mode="cta cta--primary">Confirm Password</base-button>
    </form>
    
    

</main>
</template>
<script>
import PasswordInput from '../components/UI/PasswordInput.vue';
import BaseButton from '../components/UI/BaseButton.vue';
export default {
  components: {
    PasswordInput,
    BaseButton
  },
  data(){
    return{
      password:'',
      confirmPassword: ''
    }
  },
  methods: {
    submitForm() {
       console.log(this.email);
    }
  }
}
</script>

<style lang="scss" scoped>
  main{
    //background-image: url("../assets/images/lokoda-bg-image.jpg");
    background-image: url("https://res.cloudinary.com/dgddraffq/image/upload/f_auto,q_auto:best/v1645181564/lokoda-bg-image_ne2ls1.jpg");
    background-repeat: no-repeat;
    background-position: center; 
    background-size: cover;
    background-color: $mid-grey;
    padding:$spacing-m $spacing-s;

    @media(min-width:$desktop){
      padding:$spacing-l $spacing-s;
    }
  }

  img{
    max-width:rem(180);
    margin: 0 auto;
    display:block;

    @media(min-width:$desktop){
      max-width:rem(290);
    }
  }

  h1{
    color: #fff;
    text-align: center;
    margin-top:$spacing-l;
  }

  p,span{
    text-align: center;
    color: #fff;
    margin-top:$spacing-s;
    display: block;
  }

  form{
    width:100%;
    max-width: rem(500);
    margin: $spacing-l auto 0 auto;
  }

  .cta{
    margin: $spacing-m auto 0 auto;
    display: block;
  }

  
</style>


