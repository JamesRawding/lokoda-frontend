<template>
  <base-text-icon-button @click="filtersVisible = !filtersVisible" buttonType="button" mode="text-icon-button text-icon-button--filter">Filter</base-text-icon-button>
  <div :class="{'filters-container--active' : filtersVisible}" class="filters-container">
      <search-bar @searched="searchValue" searchId="artistSearch" searchPlaceholder="e.g Sheffield, Johnny Band name">
      <template #label>Search</template>
    </search-bar>
    <base-dropdown @changed="dropdownValue" dropdownId="genreDropdown" v-model="genreDropdown" :isRequired="false" >
      <template #label>Genre</template>
      <template #options>
        <option v-for="genre in genres" :key="genre" :value="genre">{{genre}}</option>
      </template>
    </base-dropdown>
    <base-dropdown @changed="dropdownValue" dropdownId="distanceDropdown" v-model="distanceDropdown" :isRequired="false" >
      <template #label>Distance</template>
      <template #options>
        <option v-for="distance in distances" :key="distance" :value="distance">{{distance}} miles</option>
      </template>
    </base-dropdown>
  </div>
</template>

<script>
import BaseDropdown from '../UI/BaseDropdown.vue';
import BaseTextIconButton from '../UI/BaseTextIconButton.vue';
import SearchBar from '../UI/SearchBar.vue';
export default {
  components: {
    BaseDropdown,
    SearchBar,
    BaseTextIconButton
  },
  data(){
    return{
      genres:['Any', 'Alternative', 'Rock', 'Punk'],
      genreDropdown: 'Any',
      distances:['0 - 15', '15 - 20', '20 - 30', '30 - 40'],
      distanceDropdown: '0 - 15',
      filtersVisible: false
    }
  },
  methods:{
    dropdownValue(value){
      console.log(value) 
    },
    searchValue(value){
      console.log(value) 
    }
  }
}

</script>

<style lang="scss" scoped>
  .filters-container{
    height: 0;
    overflow: hidden;
    transition: .25s height ease-in-out;
    margin-top:$spacing-s;
    margin-left:rem(-16);
    margin-right:rem(-16);
    padding: $spacing-s;

    @media(min-width:$desktop){
      height: auto;
      display: grid;
      grid-column-gap: rem(32);
      grid-template-columns: 1fr 1fr 1fr;
      box-shadow: none;
    }

    &--active{
      box-shadow: $box-shadow;
      height: 392px;
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


