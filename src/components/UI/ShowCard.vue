<template>
  <base-card mode="show-card">
    <div class="show-card__date">
      <span class="show-card__month"><slot name="month"></slot></span>
      <span class="show-card__day"><slot name="day"></slot></span>
      <span class="show-card__year"><slot name="year"></slot></span>
    </div>
    <div class="show-card__location">
      <span class="show-card__city"><slot name="city"></slot></span>
      <div>
        <span class="show-card__venue"><slot name="venue"></slot></span>
        <span class="show-card__time"> - <slot name="time"></slot></span>
      </div>
    </div>
    <slot name="status"></slot>
    <div class="show-card__buttons" v-if="$store.state.loggedIn && $store.state.userID == profileID">
      <base-icon-button @click.stop="editShow" mode="icon-button icon-button--ellipsis" ariaLabel="Edit show"></base-icon-button>
      <base-icon-button @click.stop="deleteShow" mode="icon-button icon-button--trash" ariaLabel="Delete show"></base-icon-button>
    </div>
  </base-card>
</template>

<script>
import BaseCard from '../UI/BaseCard.vue'
import BaseIconButton from '../UI/BaseIconButton.vue'
export default {
  emits:['editThisShow', 'deleteThisShow'],
  components:{
    BaseCard,
    BaseIconButton
  },
  data(){
    return {
      profileID: '',
    }
  },
  methods:{
    editShow(){
      this.$emit('editThisShow')
    },
    deleteShow(){
      this.$emit('deleteThisShow')
    }
  },
  mounted() {
    const url = this.$route.params.profileURL;
    this.profileID = url;
  }
  
}
</script>

<style lang="scss" scoped>
  .show-card{
    display: flex;
    align-items: center;
    padding:0;
    margin-top: $spacing-s;
    position: relative;
    overflow: hidden;
    @media(min-width:$desktop){
      padding-right: $spacing-s;
      margin-top: $spacing-m;
      cursor: pointer;
      transition: all .25s ease-in-out;
      border: 1px solid transparent;

      &:hover,
      &:focus{
        border-color: $dark-green;
      }
    }

    &:first-of-type{
      margin-top: $spacing-m;
    }

    &__date{
      background-color: $primary;
      display: flex;
      flex-direction: column;
      align-items: center;
      width:rem(60);
      flex: 0 0 rem(60);
      padding:$spacing-xxs;

      @media(min-width:$desktop){
        width:rem(66);
        flex: 0 0 rem(66);
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
      padding:$spacing-s;
      text-transform: capitalize;

      @media(min-width:$desktop){
        padding:0 $spacing-m;
        flex: 1 0 auto;
      }
    }

    &__city{
      font-weight: bold;
    }

    &__venue,
    &__time{
      font-size: $copy-mobile-s;
      @media(min-width:$desktop){
        font-size: $copy-desktop-s;
      }
    }

    &__buttons{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex: 1 0 auto;
    }
  }
</style>