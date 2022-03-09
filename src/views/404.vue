<template>
  <main class="page-container">
    <!-- <the-header></the-header> -->
    <router-link v-if="loggedIn" to="/profile"><img src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo-reverse_bjnnfx.svg" alt="lokoda logo"><span class="sr-only">user profile</span></router-link>
    <router-link v-else to="/"><img src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo-reverse_bjnnfx.svg" alt="lokoda logo"><span class="sr-only">Log in</span></router-link>

    <section>
      <h1>Looks like the band might be lost backstage!</h1>
      <p>Try searching for Local Artists &amp; Promoters on our Discover page.</p>
      <router-link to="/discover">Discover <span class="sr-only">Local Artists &amp; Promoters</span></router-link>
    </section>
  </main>
  
</template>

<script>

export default {
  data(){
    return{
      loggedIn: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-container{
    background-image: url("https://res.cloudinary.com/dgddraffq/image/upload/f_auto,q_auto:best/v1645626077/404-bg-image_vupdj5.jpg");
    background-repeat: no-repeat;
    background-position: center; 
    background-size: cover;
    background-color: $copy;
    color: #fff;
    text-align: center;
    max-width: none;
  }

  h1{
    margin-top: $spacing-xl;
  }

  p{
    color: #fff;
    margin-top: $spacing-m;
  }
  
  img{
    max-width:rem(180);
    margin: 0 auto;
    display:block;

    @media(min-width:$desktop){
      max-width:rem(290);
    }
  }

  

  section a{
    @include cta;
    @include cta--primary;
    text-decoration: none;
    display: inline-block;
    margin-top:$spacing-l;
  }
</style>



