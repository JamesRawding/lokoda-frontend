<template>
  <main class="page-container">
    <the-header></the-header>
    <section class="hero-section">
      <div class="hero-section__image">
        <div v-if="profileImageURL">
          <img src="../assets/images/dummy-hero-img.jpg" alt="profile image">
          <base-icon-button v-if="loggedIn" @click="displaySettingsDialog('Hero Image')" mode="icon-button icon-button--edit icon-button--round">Edit Image</base-icon-button>
        </div>
        <div v-else>
          <base-text-icon-button @click="displaySettingsDialog('Hero Image')" mode="text-icon-button text-icon-button--plus">Add Image</base-text-icon-button>
        </div>
        <base-dialog v-if="heroDialogVisible"  @closeDialog="hideSettingsDialog('Hero Image')">
          <strong>Select Image</strong>
          <div v-if="profileImageURL" class="hero-image-thumb">
            <img src="../assets/images/dummy-hero-img.jpg" alt="profile image">
          </div>
          <form @submit.prevent="submitForm">
            <choose-file-button mode="test" fileUploadID="uploadImage" fileUploadName="filename">
              Choose New Image
            </choose-file-button>
            <base-text-icon-button @click="displaySettingsDialog('Delete Hero')" mode="text-icon-button text-icon-button--trash" buttonType="button">Delete Image</base-text-icon-button>

            <base-button buttonType="submit" mode="cta cta--primary">Save</base-button>
          </form>
        </base-dialog>
      </div>
      <div class="hero-section__details">
        <h1>{{profileName}}</h1>
        <p>{{profileLocation}}</p>
      </div> 
    </section>
  </main>
</template>

<script>
import vClickOutside from 'click-outside-vue3'
import TheHeader from '../components/layouts/TheHeader.vue';
import BaseTextIconButton from '../components/UI/BaseTextIconButton.vue';
import BaseDialog from '../components/UI/BaseDialog.vue';
import ChooseFileButton from '../components/UI/ChooseFileButton.vue';
import BaseButton from '../components/UI/BaseButton.vue';
import BaseIconButton from '../components/UI/BaseIconButton.vue';
// import BaseInput from '../components/UI/BaseInput.vue';
export default {
  components:{
    TheHeader,
    BaseTextIconButton,
    BaseDialog,
    ChooseFileButton,
    BaseButton,
    BaseIconButton
    // BaseInput
  },
  data() {
    return{
      loggedIn: true,
      profileName: '',
      profileLocation: '',
      profileImageURL: true,
      profiles:[
        {
          profileURL: 'down-to-folk',
          profileName: 'Down to Folk',
          profileLocation: 'Sheffield'
        },
        {
          profileURL: 'goldie-lookin-chain',
          profileName: 'Goldie lookin chain',
          profileLocation: 'Hull'
        }
      ],
      heroDialogVisible: false,
    }
    
  },
  methods:{
     displaySettingsDialog(evt){
      if(evt == 'Hero Image'){
        this.heroDialogVisible = true
      }
    },
    hideSettingsDialog(evt){
      if(evt == 'Hero Image'){
        this.heroDialogVisible = false
      }
    },
  },
  created(){
    
    const url = this.$route.params.profileURL;
    const selectedUser = this.profiles.find(profile => profile.profileURL === url);
    this.profileName = selectedUser.profileName;
    this.profileLocation = selectedUser.profileLocation;

  },
  directives: {
    clickOutside: vClickOutside.directive
  }
}
</script>

<style lang="scss" scoped>
  .hero-section{
    background-color: $dark-green;
    width:calc(100% + $spacing-m);
    margin: $spacing-s rem(-16) 0 rem(-16);

    &__details{
      padding: $spacing-s;
    }

    h1,p{
      color: #fff;
    }

    &__image{
      background-color: $lightgrey;
      display: flex;
      justify-content: center;
      align-items: center;
      height: rem(200);
      overflow:hidden;
      position: relative;

      .icon-button{
        position:absolute;
        bottom: $spacing-s;
        right:$spacing-s;
      }
    }
  }

  dialog .cta--primary{
    margin: 2rem auto 0 auto;
    display: block;
  }

  .hero-image-thumb{
    margin-top:$spacing-s;
  }
</style>