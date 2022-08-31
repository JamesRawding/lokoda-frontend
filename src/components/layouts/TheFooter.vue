<template>
  <footer>
    <div class="footer-container">
      <nav>
        <router-link  to="/privacy-policy">Privacy Policy</router-link>
        <router-link  to="/terms-and-conditions">Terms &amp; Conditions</router-link>
      </nav>
      <span>&copy; Lokoda {{copyrightYear}}</span>
    </div>
    
  </footer>
  <the-cookie-banner></the-cookie-banner>
</template>

<script>
import TheCookieBanner from '../layouts/TheCookieBanner.vue';
export default ({
  components:{
    TheCookieBanner
  },
  data() {
    return{
      copyrightYear: ''
    }  
  },
  mounted(){
    this.copyrightYear = new Date().getFullYear()
  }
})
</script>


<style lang="scss" scoped>
footer{
  background-color: $copy;
  color: #fff;
  margin-top: auto;

  font-size: $copy-mobile-s;
  @media(min-width: $desktop){
    font-size: $copy-desktop-s;
  }

  a{
    color: #fff;
    padding: rem(15) 0;
    display: block;

    @media(min-width: $desktop){
      padding: rem(14) 0;
      margin-right: $spacing-m;
    }
  }

  span{
    display: block;
    margin-top: $spacing-m;

    @media(min-width: $desktop){
      margin-top: 0;
    }
  }
}

.footer-container{
  max-width: rem(1200);
  margin: 0 auto;
  width: 100%;
  padding: $spacing-s $spacing-s rem(76) $spacing-s;
  text-align: center;
  

  @media(min-width: $desktop){
    padding: $spacing-m;
    display: flex;
    justify-content: space-between;
    text-align: left;
    align-items: center;
  }
}

nav{
  @media(min-width: $desktop){
    display: flex;
  }
}
</style>