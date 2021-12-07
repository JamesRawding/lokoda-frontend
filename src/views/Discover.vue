<template>
  <main class="page-container">
    <the-header></the-header>
    <h1>Discover</h1>
    <p>Find artists/promoters in your area. Search by <strong>city/postcode</strong> or by <strong>name</strong>.</p>
    <div class="segmented-controls">
      <base-button :class="{'segmented-control--active': artistsVisible}" mode="cta cta--secondary" buttonType="button" @click="showResultType('artist')">Artists</base-button>
      <base-button :class="{'segmented-control--active': promotersVisible}" mode="cta cta--secondary" buttonType="button" @click="showResultType('promoter')">Promoters</base-button>
    </div>
    <the-filters></the-filters>
    <div v-if="artistsVisible">
      <h2><span>Artists from</span>Sheffield</h2>   
    </div>
    <div v-if="promotersVisible">
      <h2><span>Promoters from</span>Sheffield</h2>   
    </div>
  </main>
</template>


<script>
import TheHeader from '../components/layouts/TheHeader.vue';
import TheFilters from '../components/layouts/TheFilters.vue';
import BaseButton from '../components/UI/BaseButton.vue';

export default {
  components:{
    TheHeader,
    TheFilters,
    BaseButton  
  },
  data(){
    return{
      artistsVisible: true,
      promotersVisible: false,
    }
  },
  methods:{
    showResultType(result){
      if(result == 'artist'){
        this.artistsVisible = true;
        this.promotersVisible = false
      }else{
        this.artistsVisible = false;
        this.promotersVisible = true
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
  .segmented-controls{
    display: flex;
    justify-content: center;
    margin-top: $spacing-m;
    

    button{
      min-width: rem(158);
      &:first-of-type{
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &:last-of-type{
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      @media(min-width:$desktop){
        min-width: rem(182);
      }
    }
  }

  .segmented-control--active{
    background-color: $dark-green;
    color:#fff;
  }
</style>


