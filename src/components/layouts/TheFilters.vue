<template>
  <base-text-icon-button @click="filtersVisible = !filtersVisible" buttonType="button" mode="text-icon-button text-icon-button--filter"><span v-if="filtersVisible">Close filter</span><span v-else>Filter</span></base-text-icon-button>
  <div :class="{'filters-container--active' : filtersVisible}" class="filters-container">
    <search-bar @searched="searchLocationValue" searchId="locationSearch" searchPlaceholder="e.g Sheffield, S10">
      <template #label>Search by location</template>
    </search-bar>
    <search-bar @searched="searchNameValue" searchId="nameSearch" searchPlaceholder="e.g Bandy McBandface">
      <template #label>Search by name</template>
    </search-bar>
    <base-dropdown @changed="genreValue" dropdownId="genreDropdown" v-model="genreDropdown" :isRequired="false" >
      <template #label>Genre</template>
      <template #options>
        <option v-for="genre in genres" :key="genre" :value="genre">{{genre}}</option>
      </template>
    </base-dropdown>
    <base-dropdown v-if="!locationEntered" @changed="distanceValue" dropdownId="distanceDropdown" v-model="distanceDropdown" :isRequired="false" isDisabled>
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
    </base-dropdown>
    <base-button @click="filtersVisible = !filtersVisible" mode="cta cta--secondary" buttonType="button">View Results</base-button>
  </div>
</template>

<script>
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
      genres:['Any', 'Alternative','Blues','Classical','Country','Electronic','Folk','Funk',
              'Hip-Hop','Indie','Jazz','Latin','Metal','Pop','R&B','Reggae','Rock','Soul'],
      genreDropdown: 'Any',
      distances:['0 - 15', '15 - 20', '20 - 30', '30 - 40'],
      distanceDropdown: '0 - 15',
      filtersVisible: false,
      locationEntered: false,
    }
  },
  methods:{
    genreValue(value){
      const genreValue = value;
      this.$emit('changedGenre', genreValue);
    },
    distanceValue(value){
      const distanceValue = value;
      this.$emit('changedDistance', distanceValue);
    },
    searchNameValue(value){
      const searchValue = value;
      this.$emit('changedNameSearch', searchValue);
    },
    searchLocationValue(value){
      if(value === ''){
        this.locationEntered = false;
      }else{
        this.locationEntered = true;
      }
      const searchValue = value;
      this.$emit('changedLocationSearch', searchValue);
    }
  }
}

</script>

<style lang="scss" scoped>
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
      grid-template-columns:1fr 1fr 1fr 1fr;
      box-shadow: none;
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
    margin-top:$spacing-m;
    margin-left: auto;

    @media(min-width:$desktop){
      display: none;
    }
  }
</style>


