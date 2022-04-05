<template>
<main>
    <!-- <img src="../assets/images/lokoda-logo-reverse.svg" alt="lokoda logo"> -->
    <img src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo-reverse_bjnnfx.svg" alt="lokoda logo">
    <h1>Log In</h1>
    <p>Welcome back</p>


    <form @submit.prevent="submitForm">
      <p class="error-message" v-if="incorrectLogin">Something doesn't seem right, is your email/password correct?</p>
      <base-input class="dark" inputId="email" inputType="email" v-model="form.email" :isRequired="false" >
        <template #label>Email</template>
      </base-input>
      <password-input class="dark" inputId="password" v-model="form.password" :isRequired="false" >
        <template #label>Password</template>
      </password-input>
      <div class="link-container">
        <router-link to="/password-reset">Forgot password?</router-link>
      </div>
      <base-button buttonType="submit" mode="cta cta--primary">Log In</base-button>
    </form>
    <span class="registration-text">Not got an account? <router-link to="/registration">Sign up now</router-link></span>
    
    

</main>
</template>
<script>
import axios from 'axios';
import PasswordInput from '../components/UI/PasswordInput.vue';
import BaseInput from '../components/UI/BaseInput.vue';
import BaseButton from '../components/UI/BaseButton.vue';
export default {
  components: {
    PasswordInput,
    BaseInput,
    BaseButton,
  },
  mounted() {
      // axios.get('/health_check')
      //     .then (response => {
      //         console.log("Back end health check okay");
      //         console.log(response);
      //     });
  },
  data(){
    return{
        form: { 
          email:'',
          password:'',
        },
        incorrectLogin: false,
    }
  },
  methods: {
    submitForm() {
       axios.post('/login', this.form)
            .then((res) => {
                
                this.$store.commit({
                    type: 'login',
                    userID: res.data.id,
                    token: res.data.token,
                    cookieID: res.data.id
                });
                
                

            
                function setCookie(cname, cvalue, exdays) {
                  const d = new Date();
                  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                  let expires = "expires="+d.toUTCString();
                  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
                }

                setCookie('loggedIn',res.data.id, 2 );
                this.$router.push('/profile/' + res.data.id);

            });
            
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

    .link-container{
      text-align: right;
    }

    a{
      display: inline-block;
      margin-top:$spacing-s;
      font-size: $copy-mobile-s;

      @media(min-width:$desktop){
        font-size: $copy-desktop-s;
      }
    }
  }

  a{
    color: #fff;
  }

  .cta{
    margin: $spacing-m auto 0 auto;
    display: block;
  }

  .registration-text{
    margin-top: $spacing-m;
    font-size: $copy-mobile-s;

    @media(min-width:$desktop){
        margin-top: $spacing-l;
        font-size: $copy-desktop-s;
      }
  }

  
</style>


