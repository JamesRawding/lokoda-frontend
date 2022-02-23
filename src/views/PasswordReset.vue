<template>
<main>
    <!-- <img src="../assets/images/lokoda-logo-reverse.svg" alt="lokoda logo"> -->
    <img src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo-reverse_bjnnfx.svg" alt="lokoda logo">

    <h1>Password Reset</h1>
    <p>Reset your password to get back on track.</p>

    <form @submit.prevent="submitForm">
      <base-input class="dark" inputId="email" inputType="email" v-model="email" :isRequired="false" >
      <template #label>Email</template>
      <template #helpertext>Enter the email used when registering.</template>
      </base-input>
      <base-button buttonType="submit" mode="cta cta--primary">Reset Password</base-button>
    </form>
    
    

</main>
</template>
<script>
import BaseInput from '../components/UI/BaseInput.vue';
import BaseButton from '../components/UI/BaseButton.vue';
export default {
  components: {
    BaseInput,
    BaseButton
  },
  data(){
    return{
      email:'',
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


