<template>
  <main>
    <div class="grid-parent">
      <div class="form-column">
        <!-- <img src="../assets/images/lokoda-logo-reverse.svg" alt="lokoda logo"> -->
        <img src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo-reverse_bjnnfx.svg" alt="lokoda logo">

        <h1>Register Now</h1>
        <p>Create an account today. Already a user? <router-link to="/login">Log in here</router-link></p>
        <form @submit.prevent="submitForm">
          <fieldset>
            <legend>Account Type <span>(required)</span></legend>
            <base-pill-button 
              :class="{'pill-button--selected': form.account_type === 'artist'}"
              @click="accountTypeSelected('artist')" 
              buttonType="button" 
              mode="pill-button pill-button--reverse">
              Artist
            </base-pill-button>
            <base-pill-button 
              :class="{'pill-button--selected': form.account_type === 'promoter'}"
              @click="accountTypeSelected('promoter')"  
              buttonType="button" 
              mode="pill-button pill-button--reverse">
              Promoter
            </base-pill-button>
          </fieldset>
          

          <base-input v-if="form.account_type === 'artist'" class="dark" inputId="artistName" inputType="text" v-model="form.name" :isRequired="true" >
            <template #label>Name</template>
            <template #helpertext>How you want to be discovered e.g. band name, artist name.</template>
          </base-input>
          <base-input v-else class="dark" inputId="promoterName" inputType="text" v-model="form.name" :isRequired="true" >
            <template #label>Name</template>
            <template #helpertext>How you want to be discovered e.g. company name, your name.</template>
          </base-input>
          <base-input class="dark" inputId="location" inputType="text" v-model="form.location" :isRequired="true" >
            <template #label>Location</template>
            <template #helpertext>Enter your city to help your fans find you.</template>
          </base-input>
          <p class="error-message" v-if="userExists">There is already an account with that email.</p>
          <base-input class="dark" inputId="email" inputType="email" v-model="form.email" :isRequired="true" >
            <template #label>Email</template>
          </base-input>
          <password-input class="dark" inputId="createPassword" v-model="form.password" :isRequired="true" >
            <template #label>Create Password</template>
            <template #helpertext>Must be at least 8 characters long.</template>
          </password-input>
          <p class="error-message password-mismatch" v-if="passwordMismatch">Those passwords don't match</p>
          <password-input class="dark" inputId="confirmPassword" v-model="form.confirmPassword" :isRequired="true" >
            <template #label>Confirm Password</template>
          </password-input>
          <base-button buttonType="submit" mode="cta cta--primary">Register</base-button>
          <p class="disclaimer">We don't share any of your information with third parties.</p>
        </form>
      </div>
      <div class="branding-column">
        <p>
          KEEPING LOCAL MUSIC ALIVE
        </p>
        <!-- <img src="../assets/images/lokoda-logo-reverse.svg" alt="lokoda logo"> -->
        <img src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo-reverse_bjnnfx.svg" alt="lokoda logo">

      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import PasswordInput from '../components/UI/PasswordInput.vue';
import BaseInput from '../components/UI/BaseInput.vue';
import BasePillButton from '../components/UI/BasePillButton.vue';
import BaseButton from '../components/UI/BaseButton.vue';
export default {
  components: {
    PasswordInput,
    BaseInput,
    BasePillButton,
    BaseButton  
  },
  data(){
    return{
        form: {
          account_type: 'artist',
          name: '',
          email:'',
          location:'',
          password:'',
          confirmPassword:'',
        },
        passwordMismatch: false,
        userExists: false,
    }
  },
  mounted() {
      axios.get('/api/health_check')
          .then (response => {
              console.log("Back end health check okay");
              console.log(response);
          });
  },
  methods: {
    submitForm() {
      if(this.form.password != this.form.confirmPassword && this.form.password != ""){
        this.passwordMismatch = true;
      }else{
       
        this.passwordMismatch = false;
        axios.post('/api/register', this.form)
          .then((res) => {
            if(res.data.error == "User already exists!"){
              this.userExists = true
            }else{
              this.userExists = false;
              this.$store.commit({
                    type: 'login',
                    userID: res.data.id,
                    token: res.data.token,
                    cookieID: res.data.id
                });
                
                

            
                function setCookie(cname, cvalue, exdays) {
                  const d = new Date();
                  d.setTime(d.getTime() + (exdays += 3600 * 1000));
                  let expires = "expires="+d.toUTCString();
                  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
                }
                

                setCookie('loggedIn',res.data.id, 2 );
                this.$router.push('/profile/' + res.data.id);
            }
          });
      }
       
    },
    accountTypeSelected(box) {
      if (box === 'artist') {
        this.form.account_type = 'artist'
      }else{
        this.form.account_type = 'promoter'
      }
    },
  }
}
</script>

<style lang="scss" scoped>

  .grid-parent{
    @media(min-width:$desktop){
      display: grid;
      grid-template-columns: 1fr 1fr;
      position: fixed;
      top:0;
      bottom:0;
      right:0;
      left: 0;
    }
  }

  .branding-column{
    display: none;

    @media(min-width:$desktop){
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background-color: $copy;
      font-size: rem(100);
      padding:$spacing-l;
    }

    p{
      text-align: left;
      font-weight: bold;
      line-height: 1.2;
      margin-top:0;
      max-width: rem(560);
    }

    img{
      margin: 0;
    }
  }
  .form-column{
    //background-image: url("../assets/images/lokoda-bg-image.jpg");
    background-image: url("https://res.cloudinary.com/dgddraffq/image/upload/f_auto,q_auto:best/v1645181564/lokoda-bg-image_ne2ls1.jpg");
    background-repeat: no-repeat;
    background-position: center; 
    background-size: cover;
    background-color: $mid-grey;
    padding:$spacing-m $spacing-s;

    @media(min-width:$desktop){
      padding:$spacing-l;
      order:2;
      overflow:auto;

      img{
        display: none;
      }
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

    @media(min-width:$desktop){
      margin-top: 0;
    }
  }

  p{
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

  fieldset{
    legend{
      color: #fff;
      font-weight: bold;
      margin-bottom: $spacing-s;

      span{
        font-weight: normal;
        margin-left: $spacing-s;
        font-size: $copy-mobile-s;

        @media(min-width:$desktop){
          font-size: $copy-desktop-s;
        }
      }
    }
  }

  .pill-button:first-of-type{
    margin-right:$spacing-s;
  }

  a{
    color: #fff;
  }

  .cta{
    margin: $spacing-m auto 0 auto;
    display: block;
  }

  .disclaimer{
    font-size: $copy-mobile-s;
    margin-top:$spacing-m;

    @media(min-width:$desktop){
      font-size: $copy-desktop-s;
    }
  }

  .password-mismatch{
    margin-top:$spacing-m;
  }

  
</style>
