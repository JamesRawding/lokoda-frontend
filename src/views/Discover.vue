<template>
  <main class="page-container">
    <the-header></the-header>
    <section class="discover-intro">
      <h1>Discover</h1>
      <p>Find artists/promoters in your area. Search by <strong>city/postcode</strong> or by <strong>name</strong>.</p>
    </section>
    <div class="segmented-controls">
      <base-button :class="{'segmented-control--active': artistsVisible}" mode="cta cta--secondary" buttonType="button" @click="showResultType('artist')">Artists</base-button>
      <base-button :class="{'segmented-control--active': promotersVisible}" mode="cta cta--secondary" buttonType="button" @click="showResultType('promoter')">Promoters</base-button>
    </div>
    <the-filters @changedSearch="enteredSearch" @changedGenre="selectedGenre" @changedDistance="selectedDistance"></the-filters>
    <div v-if="artistsVisible">
      <h2><span>Artists from </span>Sheffield</h2>
      <div class="grid-parent">
        <base-card v-for="band in bands" :key="band">
          <img :src=band.image :alt=band.alt>
          <a :href=band.url> <h3>{{band.name}}</h3></a>
          <span class="location">{{band.location}}</span>
          <base-pill v-for="genre in band.genres" :key="genre + band.name">
            {{genre}}
          </base-pill>
        </base-card>
      </div>     
    </div>
    <div v-if="promotersVisible">
      <h2><span>Promoters from </span>Sheffield</h2>
      <div class="grid-parent">
        <base-card v-for="promoter in promoters" :key='promoter'>
          <img :src=promoter.image :alt=promoter.alt>
          <a :href=promoter.url> <h3>{{promoter.name}}</h3></a>
          <span class="location">{{promoter.location}}</span>
          <base-pill v-for="genre in promoter.genres" :key="genre + promoter.name">
            {{genre}}
          </base-pill>
        </base-card> 
      </div>  
    </div>
  </main>
</template>


<script>
import TheHeader from '../components/layouts/TheHeader.vue';
import TheFilters from '../components/layouts/TheFilters.vue';
import BaseButton from '../components/UI/BaseButton.vue';
import BaseCard from '../components/UI/BaseCard.vue';
import BasePill from '../components/UI/BasePill.vue';

export default {
  components:{
    TheHeader,
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
      bands:[
        {
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Paragon_%28band%29_-_B%C3%B6rsencrash_Festival_Wuppertal_2016-AL1745.jpg/660px-Paragon_%28band%29_-_B%C3%B6rsencrash_Festival_Wuppertal_2016-AL1745.jpg',
          alt:'Image of Down to folk',
          name: 'Down To Folk',
          url: '/down-to-folk',
          location: 'Sheffield',
          genres: ['Folk','Hip-Hop', 'Pop']

        },
        {
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Paragon_%28band%29_-_B%C3%B6rsencrash_Festival_Wuppertal_2016-AL1745.jpg/660px-Paragon_%28band%29_-_B%C3%B6rsencrash_Festival_Wuppertal_2016-AL1745.jpg',
          alt:'Image of Down to folk',
          name: 'Goldie Lookin Chain',
          url: '/goldie-lookin-chain',
          location: 'Sheffield',
          genres: ['Rock','Metal']

        },
        {
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Paragon_%28band%29_-_B%C3%B6rsencrash_Festival_Wuppertal_2016-AL1745.jpg/660px-Paragon_%28band%29_-_B%C3%B6rsencrash_Festival_Wuppertal_2016-AL1745.jpg',
          alt:'Image of Down to folk',
          name: 'Shawoddywoddy',
          url: '',
          location: 'Sheffield',
          genres: ['Glam','Alternative', 'Funk']

        },
        {
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Paragon_%28band%29_-_B%C3%B6rsencrash_Festival_Wuppertal_2016-AL1745.jpg/660px-Paragon_%28band%29_-_B%C3%B6rsencrash_Festival_Wuppertal_2016-AL1745.jpg',
          alt:'Image of Down to folk',
          name: 'Down To Folk',
          url: '',
          location: 'Sheffield',
          genres: ['Folk','Hip-Hop', 'Pop']

        }
      ],
      promoters:[
        {
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Paragon_%28band%29_-_B%C3%B6rsencrash_Festival_Wuppertal_2016-AL1745.jpg/660px-Paragon_%28band%29_-_B%C3%B6rsencrash_Festival_Wuppertal_2016-AL1745.jpg',
          alt:'Image of Down to folk',
          name: 'Sheer Music',
          url: '',
          location: 'Sheffield',
          genres: ['Folk','Hip-Hop', 'Pop', 'Rap', 'Country']

        },
        {
          image: '',
          alt:'Image of Down to folk',
          name: 'Johnny Promoter',
          url: '',
          location: 'Sheffield',
          genres: ['Rock','Metal']

        },
        {
          image: '',
          alt:'Image of Down to folk',
          name: 'Promotion ltd',
          url: '',
          location: 'Sheffield',
          genres: ['Glam','Alternative', 'Funk']

        },
        {
          image: '',
          alt:'Image of Down to folk',
          name: 'Gigs r us',
          url: '',
          location: 'Sheffield',
          genres: ['Folk','Hip-Hop', 'Pop']

        }
      ]
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
      console.log(value)
    },
    selectedDistance(value){
      console.log(value)
    },
    enteredSearch(value){
      console.log(value) 
    }
  }
}
</script>

<style lang="scss" scoped>
  .discover-intro{
    text-align: center;
    margin-top:$spacing-m;

    @media(min-width:$desktop){
      margin-top:$spacing-l;
    }

    p{
      margin-top:$spacing-s;
    }
  }

  .segmented-controls{
    display: flex;
    justify-content: center;
    margin-top: $spacing-m;
    

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
        min-width: rem(182);
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

  h2{
    margin-top:$spacing-m;

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

    img{
      margin-top: rem(-16);
      margin-right: rem(-16);
      margin-left: rem(-16);
      border-top-left-radius: $border-radius-reg;
      border-top-right-radius: $border-radius-reg;
      max-width: calc(100% + 32px);

      @media(min-width: $desktop){
        margin-top: rem(-32);
        margin-right: rem(-32);
        margin-left: rem(-32);
        max-width: calc(100% + 64px);
      }
    }
  }

  .location{
    display: block;
    line-height: 1.5;
    margin-top: rem(-8);
  }
</style>


