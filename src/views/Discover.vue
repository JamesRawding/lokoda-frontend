<template>
  <div class="page-loading-message" v-if="resultsLoading">
    <div><span class="spinner"></span>Results loading</div>
  </div>
  <div v-else class="page-outer">
  <the-header></the-header>
  <main class="page-container">
    
    <section class="discover-intro">
      <h1>Discover</h1>
      <p>Find artists/promoters in your area. Search by <strong>city</strong> or by <strong>name</strong>.</p>
    </section>
    <the-filters @changedNameSearch="enteredNameSearch" @changedLocationSearch="enteredLocationSearch" @changedGenre="selectedGenre" @changedDistance="selectedDistance"></the-filters>
    <div class="segmented-controls segmented-controls--mobile">
      <base-button :class="{'segmented-control--active': artistsVisible}" mode="cta cta--secondary" buttonType="button" @click="showResultType('artist')">Artists</base-button>
      <base-button :class="{'segmented-control--active': promotersVisible}" mode="cta cta--secondary" buttonType="button" @click="showResultType('promoter')">Promoters</base-button>
    </div>

  
   <transition name="fade" mode="out-in">
    <div v-if="artistsVisible">
      <div class="results-header">
        <h2><span>Artists from </span>{{currentLocationFilter}}</h2>
        <div class="segmented-controls segmented-controls--desktop">
          <base-button :class="{'segmented-control--active': artistsVisible}" mode="cta cta--secondary" buttonType="button" @click="showResultType('artist')">Artists</base-button>
          <base-button :class="{'segmented-control--active': promotersVisible}" mode="cta cta--secondary" buttonType="button" @click="showResultType('promoter')">Promoters</base-button>
        </div>
      </div>
      <div class="grid-parent">
        <base-card v-for="band in alphabetisedBandResults.slice(0, 3)" :key="band.id">
          <img v-if="band.image_url == null " width="450" height="250" src="https://res.cloudinary.com/dgddraffq/image/upload/c_limit,f_auto,q_auto:best/v1652190684/result-fallback-image_huueaz.jpg" alt="" rel="preload">
          <img v-else width="450" height="250" :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_450,h_250,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+band.image_url" :alt="band.name + ' profile image'">

          <router-link :to="'/profile/' + band.id"><h3>{{band.name}}</h3></router-link>
          <span class="location">{{band.location}}</span>
          <base-pill v-for="genre in band.genres" :key="genre + band.name">
            {{genre.genre}}
          </base-pill>
        </base-card>
        <base-card v-for="band in alphabetisedBandResults.slice(3)" :key="band.id">
          <img v-if="band.image_url !== null " class="lazyload" width="450" height="250" :data-src="'https://res.cloudinary.com/dgddraffq/image/upload/w_450,h_250,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+band.image_url" :alt="band.name + ' profile image'">
          <img v-else class="lazyload" width="450" height="250" data-src="https://res.cloudinary.com/dgddraffq/image/upload/c_limit,f_auto,q_auto:best/v1652190684/result-fallback-image_huueaz.jpg" alt="" rel="preload">
          <router-link :to="'/profile/' + band.id"><h3>{{band.name}}</h3></router-link>
          <span class="location">{{band.location}}</span>
          <base-pill v-for="genre in band.genres" :key="genre + band.name">
            {{genre.genre}}
          </base-pill>
        </base-card>
      </div>
      <div v-if="alphabetisedBandResults.length === 0">
        <strong>No bands match that search.</strong>
      </div>     
    </div>
   
    <div v-else>
      <div class="results-header">
        <h2><span>Promoters from </span>{{currentLocationFilter}}</h2>
        <div class="segmented-controls segmented-controls--desktop">
          <base-button :class="{'segmented-control--active': artistsVisible}" mode="cta cta--secondary" buttonType="button" @click="showResultType('artist')">Artists</base-button>
          <base-button :class="{'segmented-control--active': promotersVisible}" mode="cta cta--secondary" buttonType="button" @click="showResultType('promoter')">Promoters</base-button>
        </div>
      </div>
      <div class="grid-parent">
        <base-card v-for="promoter in alphabetisedPromoterResults" :key='promoter.id'>
          <img v-if="promoter.image_url !== null " class="lazyload" width="450" height="250" :data-src="'https://res.cloudinary.com/dgddraffq/image/upload/w_450,h_250,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+promoter.image_url" :alt="promoter.name + ' profile image'">
          <img v-else class="lazyload" width="450" height="250" data-src="https://res.cloudinary.com/dgddraffq/image/upload/c_limit,f_auto,q_auto:best/v1652190684/result-fallback-image_huueaz.jpg" alt="" rel="preload">
          <router-link :to="'/profile/' + promoter.id"><h3>{{promoter.name}}</h3></router-link>
          <span class="location">{{promoter.location}}</span>
          <base-pill v-for="genre in promoter.genres" :key="genre + promoter.name">
            {{genre.genre}}
          </base-pill>
        </base-card> 
      </div>
       <div v-if="alphabetisedPromoterResults.length === 0">
        <strong>No promoters match that search.</strong>
      </div>   
    </div>
    </transition>
  </main>
   <the-footer></the-footer>
  </div>
 
</template>


<script>
import axios from "axios";
import TheHeader from '../components/layouts/TheHeader.vue';
import TheFooter from '../components/layouts/TheFooter.vue';
import TheFilters from '../components/layouts/TheFilters.vue';
import BaseButton from '../components/UI/BaseButton.vue';
import BaseCard from '../components/UI/BaseCard.vue';
import BasePill from '../components/UI/BasePill.vue';

export default {
  components:{
    TheHeader,
    TheFooter,
    TheFilters,
    BaseButton,
    BaseCard,
    BasePill
  },
  data(){
    return{
      filtersVisible: false,
      artistsVisible: true,
      promotersVisible: false,
      searchNameValue: '',
      searchLocationValue: '',
      currentLocationFilter: 'All Locations',
      defaultLocation: 'All Locations',
      genreDropdownValue: '',
      distanceDropdownValue: '',
      bands:[],
      promoters:[],
      resultsLoading: false,
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
      
    },
    selectedGenre(value){
      this.genreDropdownValue = value
      //console.log(value)
    },
    selectedDistance(value){
      console.log(value)
      this.distanceDropdownValue = value
    },
    enteredNameSearch(value){
      this.searchNameValue = value;
    },
    enteredLocationSearch(value){
      this.searchLocationValue = value;
      this.currentLocationFilter = value.charAt(0).toUpperCase() + value.slice(1);
      if(value === ''){
        this.currentLocationFilter = this.defaultLocation
      }
    },
    filterByGenre(item) {
      if(item.genres){
        if (item.genres.find(e => e.id == this.genreDropdownValue)) {
        return true
        }
        return false;
        }
      
    }   
  },

  computed:{
     alphabetisedBandResults(){
      let bandResults = this.bands
      
      if(this.searchNameValue){
        bandResults = bandResults.filter(m => m.name.toLowerCase().indexOf(this.searchNameValue) > -1);
      }

      if(this.searchLocationValue === 'All Locations'){
         bandResults = bandResults.filter(m => m.location.toLowerCase().indexOf('') > -1 );
      }

      if(this.searchLocationValue){
        bandResults = bandResults.filter(m => m.location.toLowerCase().indexOf(this.searchLocationValue) > -1 );
      }

      if(this.genreDropdownValue && this.genreDropdownValue !== 'any'){
        bandResults = bandResults.filter(this.filterByGenre)    
      }
      

      return bandResults
      .filter(bandResults => bandResults.name.toLowerCase())
      .sort((a, b) => a.name.localeCompare(b.name));
    },
    alphabetisedPromoterResults(){
      let promoterResults = this.promoters
      
      if(this.searchNameValue){
        promoterResults = promoterResults.filter(m => m.name.toLowerCase().indexOf(this.searchNameValue) > -1)
      }

      if(this.currentLocationFilter === 'All Locations'){
        promoterResults = promoterResults.filter(m => m.location.toLowerCase().indexOf('') > -1 );
      }

      if(this.searchLocationValue){
        promoterResults = promoterResults.filter(m => m.location.toLowerCase().indexOf(this.searchLocationValue) > -1)
      }

      if(this.searchLocationValue){
        promoterResults = promoterResults.filter(m => m.location.toLowerCase().indexOf(this.searchLocationValue) > -1)
      }

      if(this.genreDropdownValue && this.genreDropdownValue !== 'any'){
        promoterResults = promoterResults.filter(this.filterByGenre)    
      }

      return promoterResults
      .filter(promoterResults => promoterResults.name.toLowerCase())
      .sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  mounted() {
    
    this.resultsLoading = true;
    axios.post("api/search",{
      account_type: 'artist',
    }).then((res) => {
      this.bands = res.data;
      this.resultsLoading = false;
    });

    axios.post("api/search",{
      account_type: 'promoter',
    }).then((res) => {
      this.promoters = res.data;
      //console.log(res)
    });
  }

  
}
</script>

<style lang="scss" scoped>
  .discover-intro{
    text-align: center;

    p{
      margin-top:$spacing-s;
    }
  }

  .segmented-controls{
    
    justify-content: center;
    margin-top: $spacing-m;

    &--mobile{
      display: flex;
    }

    &--desktop{
      display:none;
    }

    @media(min-width:$desktop){
      &--mobile{
        display:none;
      }

      &--desktop{
        display:flex;
        margin-top:0;
      }
    }
    

    button{
      margin: 0;
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
        min-width: rem(161);
        font-size:$copy-desktop-s;
      }
    }
  }

  .segmented-control--active{
    background-color: $dark-green;
    color:#fff;
  }

  .filters-container{
    height: 0;
    overflow: hidden;
    transition: .25s all ease-in-out;
    margin-top:$spacing-s;
    margin-left:rem(-16);
    margin-right:rem(-16);
    padding: 0 $spacing-s;

    @media(min-width:$desktop){
      height: auto;
      display: grid;
      margin: $spacing-m 0 0 0;
      padding: 0;
      grid-column-gap: rem(32);
      grid-template-columns: 1fr 1fr 1fr;
      box-shadow: none;
    }

    &--active{
      box-shadow: $box-shadow;
      height: 442px;
      padding:$spacing-s
    }

    .cta{
      margin: $spacing-m auto 0 auto;
      display: block;

      @media(min-width:$desktop){
        display: none;
      }
    }
  }

  .text-icon-button{
    margin-top:$spacing-m;
    margin-left: auto;

    @media(min-width:$desktop){
      display: none;
    }
  }

  .results-header{
    display:flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  h2{
    margin-top:$spacing-m;
    text-transform: capitalize;

    @media(min-width: $desktop){
        margin-top:$spacing-l;
      }

    span{
      display: block;
      font-weight: normal;
      font-size: $copy-mobile;

      @media(min-width: $desktop){
        font-size: $copy-desktop;
      }
    }
  }

  .grid-parent{
    display: grid;
    grid-column-gap: $spacing-m;
    grid-row-gap: $spacing-m;
    margin-top:$spacing-m;

    @media(min-width: $mobile-landscape){
      grid-template-columns: 1fr 1fr;
    }

    @media(min-width: $desktop){
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  .card{
    a{
      padding:rem(9) 0;
      display: block;

      @media(min-width: $desktop){
        margin-top:$spacing-s;
      }
    }

    h3{
      text-transform: capitalize;
    }

    img{
      margin-top: rem(-16);
      margin-right: rem(-16);
      margin-left: rem(-16);
      border-top-left-radius: $border-radius-reg;
      border-top-right-radius: $border-radius-reg;
      width: calc(100% + 32px);
      max-width: calc(100% + 32px);
      height: rem(200);
     
      object-fit: cover;

      @media(min-width: $desktop){
        margin-top: rem(-32);
        margin-right: rem(-32);
        margin-left: rem(-32);
        width: calc(100% + 64px);
        max-width: calc(100% + 64px);
      }
    }
  }

  .location{
    display: block;
    line-height: 1.5;
    margin-top: rem(-8);
    text-transform: capitalize;
  }
</style>


