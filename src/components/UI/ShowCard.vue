<template>
  <base-card mode="show-card">
    <div class="show-card__date">
      <span class="show-card__month"><slot name="month"></slot></span>
      <span class="show-card__day"><slot name="day"></slot></span>
      <span class="show-card__year"><slot name="year"></slot></span>
    </div>
    <div class="show-card__location">
      <span class="show-card__city"><slot name="city"></slot></span>
      <span class="show-card__venue"><slot name="venue"></slot></span>
    </div>

    <div class="show-card__buttons" v-if="loggedIn">
      <base-icon-button @click="editShow" mode="icon-button icon-button--ellipsis" ariaLabel="Edit show"></base-icon-button>
      <base-icon-button @click="deleteShow" mode="icon-button icon-button--trash" ariaLabel="Delete show"></base-icon-button>
    </div>
  </base-card>
</template>

<script>
import BaseCard from '../UI/BaseCard.vue'
import BaseIconButton from '../UI/BaseIconButton.vue'
export default {
  props:['loggedIn'],
  emits:['editThisShow', 'deleteThisShow'],
  components:{
    BaseCard,
    BaseIconButton
  },
  methods:{
    editShow(){
      this.$emit('editThisShow')
    },
    deleteShow(){
      this.$emit('deleteThisShow')
    }
  }
  
}
</script>

<style lang="scss" scoped>
  .show-card{
    display: flex;
    align-items: center;
    padding:0;
    margin-top: $spacing-s;
    @media(min-width:$desktop){
      padding-right: $spacing-s;
      margin-top: $spacing-m;
    }

    &:first-of-type{
      margin-top: $spacing-m;
    }

    &__date{
      background-color: $primary;
      display: flex;
      flex-direction: column;
      align-items: center;
      width:rem(58);
      padding:$spacing-xxs;

      @media(min-width:$desktop){
        width:rem(66);
      }
    }

    &__day,
    &__month,
    &__year,
    &__venue,
    &__city{
      line-height: 1.2;
    }

    &__day,
    &__month,
    &__year{
      display: block;
    }

    &__day{
      font-weight: bold;
    }

    &__month,
    &__year{
      font-size: $copy-mobile-xs;
      @media(min-width:$desktop){
        font-size: $copy-desktop-xs;
      }
    }

    &__location{
      display: flex;
      flex-direction: column;
      flex: 1 0 auto;
      padding:0 $spacing-s;

      @media(min-width:$desktop){
        padding:0 $spacing-m;
      }
    }

    &__city{
      font-weight: bold;
    }

    &__venue{
      font-size: $copy-mobile-s;
      @media(min-width:$desktop){
        font-size: $copy-desktop-s;
      }
    }

    &__buttons{
      display: flex;
      align-items: center;
    }
  }
</style>