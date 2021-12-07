<template>
  
    <h1>Design Components</h1>
    <h2>Buttons</h2>

    <base-button buttonType="button" mode="cta cta--primary">Primary CTA</base-button>
    <base-button buttonType="submit" mode="cta cta--secondary">Secondary CTA</base-button>

    <base-icon-button buttonType="button" mode="icon-button icon-button--new-message">New Message</base-icon-button>
    <base-icon-button buttonType="submit" mode="icon-button icon-button--ellipsis">More Options</base-icon-button>

    <base-pill-button buttonType="button" mode="pill-button pill-button--default">Artist</base-pill-button>
    <base-pill-button buttonType="submit" mode="pill-button pill-button--reverse">Hip Hop</base-pill-button>

    <hr>
    <h2>Form Fields</h2>

    <base-dropdown dropdownId="dropdownName" v-model="dropdown" :isRequired="false" >
      <template #label>Name</template>
      <template #helpertext>How you want to be discovered e.g. band name, artist name.</template>
      <template #options>
        <option v-for="option in options" :key="option" :value="option">{{option}}</option>
      </template>
    </base-dropdown>

    <search-bar searchId="artistName" searchPlaceholder="e.g Sheffield, Johnny Band name" v-model="search" ></search-bar>

    <ul>
      <li v-for="option in options" :key="option">{{option}}</li>
    </ul>

   
  
</template>
<script>
import BasePillButton from '../components/UI/BasePillButton.vue';
import BaseButton from '../components/UI/BaseButton.vue';
import BaseIconButton from '../components/UI/BaseIconButton.vue';
import BaseDropdown from '../components/UI/BaseDropdown.vue';
import SearchBar from '../components/UI/SearchBar.vue';
export default {
  components: {
    BasePillButton,
    BaseButton,
    BaseIconButton,
    BaseDropdown,
    SearchBar
  },
  data(){
    return{
      options:['option1', 'option2', 'option3'],
      dropdown: 'option1'
    }
  }
}
</script>


