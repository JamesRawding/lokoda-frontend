<template>
  <main class="page-container">
    <the-header></the-header>
    <section class="settings-intro">
      <h1>Account</h1>
      <p>Change details on your account</p>
    </section>
    
    <div class="grid-parent">
      
      <div class="dialog-container">
        <div class="basic-account-info" :class="{'basic-account-info--active':!photoDialogVisible && !passwordDialogVisible && !locationDialogVisible && !nameDialogVisible }">
          <strong class="basic-account-info__heading">Your Basic Info</strong>
          <p>What people see when looking for your page.</p>
          <strong>Name</strong><span>{{currentName}}</span>
          <strong>Location</strong> <span>{{currentLocation}}</span>
        </div>
        
          <transition>
            <base-dialog v-if="photoDialogVisible"  @closeDialog="hideSettingsDialog('Profile Picture')">
              <div class="profile-pic">
                <img src="../assets/images/dummy-profile-pic.jpg" alt="profile image">
              </div>
              <strong>Edit Photo</strong>
              
              <form @submit.prevent="submitForm">
                <choose-file-button mode="test" fileUploadID="uploadImage" fileUploadName="filename">
                  Choose New Image
                </choose-file-button>
                <base-button buttonType="submit" mode="cta cta--primary">Save</base-button>
              </form>
            </base-dialog>
            </transition>
            <transition>
            <base-dialog v-if="passwordDialogVisible"  @closeDialog="hideSettingsDialog('Manage Password')">
              <strong>Manage Password</strong>
              <form @submit.prevent="submitForm">
                <password-input inputId="currentPassword" v-model="currentPassword" :isRequired="false" >
                  <template #label>Current Password</template>
                </password-input>
                <password-input inputId="newPassword" v-model="newPassword" :isRequired="false" >
                  <template #label>New Password</template>
                </password-input>
                <password-input inputId="confirmPassword" v-model="confirmPassword" :isRequired="false" >
                  <template #label>Confirm Password</template>
                </password-input>
                <base-button buttonType="submit" mode="cta cta--primary">Save</base-button>
              </form>
            </base-dialog>
            </transition>
            <transition>
            <base-dialog v-if="locationDialogVisible"  @closeDialog="hideSettingsDialog('Change Location')">
              <strong>Change Location</strong>
              <form @submit.prevent="submitLocation">
                <base-input inputId="newLocation" inputType="text" v-model="newLocation" :isRequired="false" >
                  <template #label>New Location</template>
                </base-input>
                <base-button buttonType="submit" mode="cta cta--primary">Save</base-button>
              </form>
            </base-dialog>
            </transition>
            <transition>
            <base-dialog v-if="nameDialogVisible"  @closeDialog="hideSettingsDialog('Change Name')">
              <strong>Change Name</strong>
              <form @submit.prevent="submitName">
                <base-input inputId="newName" inputType="text" v-model="newName" :isRequired="false" >
                  <template #label>New Name</template>
                </base-input>
                <base-button buttonType="submit" mode="cta cta--primary">Save</base-button>
              </form>
            </base-dialog>
            </transition>
            <transition>
            <base-dialog mode="modal-dialog modal-dialog--warning" v-if="deleteAccountDialogVisible"  @closeDialog="hideSettingsDialog('Delete Account')">
              <strong>Delete Account</strong>
              <p>Are you sure? This cant be undone!</p>
              <div class="dialog-cta-container">
                <base-button @click="hideSettingsDialog('Delete Account')" buttonType="button" mode="cta cta--secondary">Cancel</base-button>
                <base-button @click="displaySettingsDialog('Confirm Delete')" buttonType="button" mode="cta cta--warning">Delete</base-button>
              </div>
            </base-dialog>
            </transition>
            
            <base-dialog mode="modal-dialog modal-dialog--warning" v-if="confirmDeleteAccountDialogVisible"  @closeDialog="hideSettingsDialog('Confirm Delete')">
              <strong>Are you sure?</strong>
              <p>Last chance, no turning back...</p>
                <div class="dialog-cta-container">
                  <base-button @click="hideSettingsDialog('Confirm Delete')" buttonType="button" mode="cta cta--secondary">Cancel</base-button>
                  <base-button @click="displaySettingsDialog('Confirm Delete')" buttonType="button" mode="cta cta--warning">Delete</base-button>
                </div>
            </base-dialog>
          
          
       
      </div>
      <div class="sidebar-nav">
        <base-text-icon-button @click="displaySettingsDialog('Profile Picture')" mode="text-icon-button text-icon-button--photo" :class="{'text-icon-button--active': photoDialogVisible}" buttonType="button">Edit Profile Picture</base-text-icon-button>
        <base-text-icon-button @click="displaySettingsDialog('Manage Password')" mode="text-icon-button text-icon-button--key" :class="{'text-icon-button--active': passwordDialogVisible}" buttonType="button">Manage Password</base-text-icon-button>
        <base-text-icon-button @click="displaySettingsDialog('Change Location')" mode="text-icon-button text-icon-button--marker" :class="{'text-icon-button--active': locationDialogVisible}" buttonType="button">Change Location</base-text-icon-button>
        <base-text-icon-button @click="displaySettingsDialog('Change Name')" mode="text-icon-button text-icon-button--tag" :class="{'text-icon-button--active': nameDialogVisible}" buttonType="button">Change Name</base-text-icon-button>
        <base-text-icon-button @click="displaySettingsDialog('Delete Account')" mode="text-icon-button text-icon-button--trash" :class="{'text-icon-button--active': deleteAccountDialogVisible || confirmDeleteAccountDialogVisible}" buttonType="button">Delete Account</base-text-icon-button>
      </div>
    </div>
  </main>
</template>

<script>
import vClickOutside from 'click-outside-vue3'
import TheHeader from '../components/layouts/TheHeader.vue';
import BaseDialog from '../components/UI/BaseDialog.vue';
import BaseTextIconButton from '../components/UI/BaseTextIconButton.vue';
import BaseButton from '../components/UI/BaseButton.vue';
import PasswordInput from '../components/UI/PasswordInput.vue';
import BaseInput from '../components/UI/BaseInput.vue';
import ChooseFileButton from '../components/UI/ChooseFileButton.vue';
export default {
  components:{
    TheHeader,
    BaseTextIconButton,
    BaseDialog,
    BaseButton,
    PasswordInput,
    BaseInput,
    ChooseFileButton
  },
  data() {
    return{
      photoDialogVisible: false,
      passwordDialogVisible: false,
      locationDialogVisible: false,
      nameDialogVisible: false,
      deleteAccountDialogVisible: false,
      confirmDeleteAccountDialogVisible: false,
      currentName: 'Name from account',
      currentLocation: 'Location from account',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      newLocation: '',
      newName: ''

    } 
  },
  methods:{
    displaySettingsDialog(evt){
      if(evt == 'Profile Picture'){
        this.photoDialogVisible = true
      }
      if(evt == 'Manage Password'){
        this.passwordDialogVisible = true
      }
      if(evt == 'Change Location'){
        this.locationDialogVisible = true
      }
      if(evt == 'Change Name'){
        this.nameDialogVisible = true
      }
      if(evt == 'Delete Account'){
        this.deleteAccountDialogVisible = true
      }
      if(evt == 'Confirm Delete'){
        this.deleteAccountDialogVisible = false
        this.confirmDeleteAccountDialogVisible = true
      }
      
    },
    hideSettingsDialog(evt){
      if(evt == 'Profile Picture'){
        this.photoDialogVisible = false
      }
      if(evt == 'Manage Password'){
        this.passwordDialogVisible = false
      }
      if(evt == 'Change Location'){
        this.locationDialogVisible = false
      }
      if(evt == 'Change Name'){
        this.nameDialogVisible = false
      }
       if(evt == 'Delete Account'){
        this.deleteAccountDialogVisible = false
      }
      if(evt == 'Confirm Delete'){
        this.confirmDeleteAccountDialogVisible = false
      }
    },
    submitName(){
      this.currentName = this.newName;
      this.newName = '';
      this.nameDialogVisible = false
    },
    submitLocation(){
      this.currentLocation = this.newLocation;
      this.newLocation = '';
      this.locationDialogVisible = false
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  }
}
</script>

<style lang="scss" scoped>
.settings-intro{
    text-align: center;
    margin-top:$spacing-m;

    @media(min-width:$desktop){
      margin-top:$spacing-l;
      
    }

    p{
      margin-top:$spacing-s;
    }
  }
  .grid-parent{
    margin-top: $spacing-m;
    @media(min-width:$desktop){
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-column-gap: $spacing-m;
    }
  }

  .basic-account-info{
    background-color: $lightgrey;
    border-radius: $border-radius-reg;
    padding: $spacing-s;
    @media(min-width:$desktop){
      display: none;
      
      &--active{
        padding: $spacing-m;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    }

    strong.basic-account-info__heading{
      font-size: $copy-mobile-m;
      margin-top:0;

      @media(min-width:$desktop){
        font-size: $copy-desktop-m;
      }
    }

    strong{
      margin-top:$spacing-m;
    }
    span{
      line-height: 1.5;
    }

    strong,
    span{
      display: block;
    }
  }

  .dialog-container{
    position: relative;

    @media(min-width:$desktop){
      order:2;
    }
  }

  dialog{
    width: 100%;

    @media(min-width:$desktop){
      border-radius: $border-radius-reg;
    }
    
    .cta--primary{
      margin: $spacing-m auto 0 auto;
      display: block;
    }
  }

  .dialog-cta-container{
    margin-top:$spacing-m;

    .cta:first-of-type{
      margin-right: $spacing-s;
    }

    @media(min-width:$desktop){
      .cta:last-of-type{
        margin-left: $spacing-s;
      }
    }
  }

  .profile-pic{
    margin: 0 auto;
    border-radius: 100%;
    overflow: hidden;
    width: 100%;
    max-width: rem(200);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom:$spacing-m;

    img{
      width:100%;
    }
  }

  .sidebar-nav{
    margin-top:$spacing-m;
    box-shadow: $box-shadow;
    padding: $spacing-s;
    @media(min-width:$desktop){
      margin-top:0;
      padding: $spacing-m;
      border-radius: $border-radius-reg;
    }
  }


</style>