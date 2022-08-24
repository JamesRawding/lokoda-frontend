<template>
  <div class="filters-block">
  <base-text-icon-button @click="filtersVisible = !filtersVisible" buttonType="button" mode="text-icon-button text-icon-button--filter"><span v-if="filtersVisible">Close filters</span><span v-else>Filters</span></base-text-icon-button>
  <div :class="{'filters-container--active' : filtersVisible}" class="filters-container">
    <search-bar @searched="searchLocationValue" searchId="locationSearch" searchPlaceholder="e.g Sheffield">
      <template #label>Search by location</template>
    </search-bar>
    <search-bar @searched="searchNameValue" searchId="nameSearch" searchPlaceholder="e.g Joan Bloggs">
      <template #label>Search by name</template>
    </search-bar>
    <base-dropdown @changed="genreValue" dropdownId="genreDropdown" v-model="genreDropdown" :isRequired="false" >
      <template #label>Genre</template>
      <template #options>
        <option>Any</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.genre_id">{{genre.genre}}</option>
      </template>
    </base-dropdown>
    <!-- <base-dropdown v-if="!locationEntered" @changed="distanceValue" dropdownId="distanceDropdown" v-model="distanceDropdown" :isRequired="false" isDisabled>
      <template #label>Distance</template>
      <template #options>
        <option v-for="distance in distances" :key="distance" :value="distance">{{distance}} miles</option>
      </template>
    </base-dropdown>
    <base-dropdown v-else @changed="distanceValue" dropdownId="distanceDropdown" v-model="distanceDropdown" :isRequired="false">
      <template #label>Distance</template>
      <template #options>
        <option v-for="distance in distances" :key="distance" :value="distance">{{distance}} miles</option>
      </template>
    </base-dropdown> -->
    <base-button @click="filtersVisible = !filtersVisible" mode="cta cta--secondary" buttonType="button">View Results</base-button>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import BaseDropdown from '../UI/BaseDropdown.vue';
import BaseTextIconButton from '../UI/BaseTextIconButton.vue';
import SearchBar from '../UI/SearchBar.vue';
import BaseButton from '../UI/BaseButton.vue';
export default {
  components: {
    BaseDropdown,
    SearchBar,
    BaseTextIconButton,
    BaseButton
  },
  emits:['changedGenre', 'changedDistance', 'changedNameSearch', 'changedLocationSearch'],
  data(){
    return{
      //genres:this.$store.state.genres,
      genres:[],
      genreDropdown: 'Any',
      distances:['0 - 15', '15 - 20', '20 - 30', '30 - 40'],
      distanceDropdown: '0 - 15',
      filtersVisible: false,
      locationEntered: false,
    }
  },
  methods:{
    genreValue(value){
      //console.log(value)
      const genreValue = value;
      this.$emit('changedGenre', genreValue.toLowerCase());
    },
    distanceValue(value){
      const distanceValue = value;
      this.$emit('changedDistance', distanceValue);
    },
    searchNameValue(value){
      const searchValue = value;
      this.$emit('changedNameSearch', searchValue.toLowerCase());
    },
    searchLocationValue(value){
      if(value === ''){
        this.locationEntered = false;
      }else{
        this.locationEntered = true;
      }
      const searchValue = value;
      this.$emit('changedLocationSearch', searchValue.toLowerCase());
    }
  },
  mounted(){
   axios.get('api/get_genres')
    .then((res) => {
        this.genres = res.data
    });
   
 }
}

</script>

<style lang="scss" scoped>
  .filters-block{
    box-shadow: $box-shadow;
    margin-left:rem(-16);
    margin-right:rem(-16);
    padding: 0 $spacing-s;
    margin-top:$spacing-m;
    background-color:$lightergrey;

    @media(min-width:$desktop){
      box-shadow: none;
      margin-left: 0;
      margin-right: 0;
      padding: 0;
    }
  }
  .filters-container{
    height: 0;
    overflow: hidden;
    transition: .25s all ease-in-out;
    margin-left:rem(-16);
    margin-right:rem(-16);
    padding: 0 $spacing-s;
    background-color: #fff;

    @media(min-width:$desktop){
      height: auto;
      display: grid;
      margin: $spacing-m 0 0 0;
      padding: 0;
      grid-column-gap: rem(32);
      grid-template-columns:1fr 1fr 1fr;
      box-shadow: none;
      background-color: $lightgrey;
      padding:0 $spacing-m $spacing-m $spacing-m;
      border-radius:$border-radius-reg;
    }



    &--active{
      box-shadow: $box-shadow;
      height: 530px;
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
    margin-left: auto;

    @media(min-width:$desktop){
      display: none;
    }
  }
</style>


