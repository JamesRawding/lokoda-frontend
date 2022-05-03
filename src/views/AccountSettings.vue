<template>
<main
    class="page-loading-message"
    v-if="profileDataLoading"
  >
    <div><span class="spinner"></span>Settings loading</div>
  </main>
  <main v-else class="page-container">
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
          <strong>Name</strong><span>{{profileName}}</span>
          <strong>Location</strong> <span>{{profileLocation}}</span>
        </div>
        
          <transition>
            <base-dialog v-if="photoDialogVisible"  @closeDialog="hideSettingsDialog('Profile Picture')">
              
              <strong>Edit Photo</strong>
              <div class="avatar-image-thumb-container">
                <div class="avatar-image-thumb">
                  <div v-if="!avatarImageURL && !imageUploading">Add image below</div>
                  <div v-if="imageUploading" class="avatar-image-uploading"><span class="spinner"></span>Image Uploading</div>
                  <img v-if="avatarImageURL" :src="avatarImageURL" :alt="profileName + ' profile image'">
                </div>
              </div>
                <choose-file-button @change="uploadImage" fileUploadID="uploadImage" fileUploadName="filename">
                  Choose New Image
                </choose-file-button>
                <base-text-icon-button @click="deleteAvatar" mode="text-icon-button text-icon-button--trash" buttonType="button">Delete Image</base-text-icon-button>
                <base-button @click="hideSettingsDialog('Profile Picture')" buttonType="button" mode="cta cta--primary">Save</base-button>
            </base-dialog>
            </transition>
            <transition>
            <base-dialog v-if="passwordDialogVisible"  @closeDialog="hideSettingsDialog('Manage Password')">
              <strong>Manage Password</strong>
              <form @submit.prevent="submitForm">
                <p class="error-message incorrect-password" v-if="incorrectPassword">The current password doesn't look right</p>
                <password-input inputId="currentPassword" v-model="currentPassword" :isRequired="false" >
                  <template #label>Current Password</template>
                </password-input>
                <password-input inputId="newPassword" v-model="newPassword" :isRequired="false" >
                  <template #label>New Password</template>
                </password-input>
                <p class="error-message password-mismatch" v-if="passwordMismatch">Those passwords don't match</p>
                <password-input inputId="confirmPassword" v-model="confirmPassword" :isRequired="false" >
                  <template #label>Confirm Password</template>
                </password-input>
                <base-button @click="setNewPassword" buttonType="submit" mode="cta cta--primary">Save</base-button>
              </form>
            </base-dialog>
            </transition>
            <transition>
            <base-dialog v-if="nameDialogVisible"  @closeDialog="hideSettingsDialog('Change Name')">
              <strong>Change Name</strong>
              <form @submit.prevent="submitName">
                <base-input inputId="newName" inputType="text" v-model="newName" :isRequired="true" >
                  <template #label>New Name</template>
                </base-input>
                <base-button buttonType="submit" mode="cta cta--primary">Save</base-button>
              </form>
            </base-dialog>
            </transition>
            <transition>
            <base-dialog v-if="locationDialogVisible"  @closeDialog="hideSettingsDialog('Change Location')">
              <strong>Change Location</strong>
              <form @submit.prevent="submitLocation">
                <base-input inputId="newLocation" inputType="text" v-model="newLocation" :isRequired="true" >
                  <template #label>New Location</template>
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
                  <base-button @click="confirmAccountDeletion" buttonType="button" mode="cta cta--warning">Delete</base-button>
                </div>
            </base-dialog>
          
          
       
      </div>
      <div class="sidebar-nav">
        <base-text-icon-button @click="displaySettingsDialog('Profile Picture')" mode="text-icon-button text-icon-button--photo" :class="{'text-icon-button--active': photoDialogVisible}" buttonType="button">Edit Profile Picture</base-text-icon-button>
        <base-text-icon-button @click="displaySettingsDialog('Manage Password')" mode="text-icon-button text-icon-button--key" :class="{'text-icon-button--active': passwordDialogVisible}" buttonType="button">Manage Password</base-text-icon-button>
        <base-text-icon-button @click="displaySettingsDialog('Change Name')" mode="text-icon-button text-icon-button--tag" :class="{'text-icon-button--active': nameDialogVisible}" buttonType="button">Change Name</base-text-icon-button>
        <base-text-icon-button @click="displaySettingsDialog('Change Location')" mode="text-icon-button text-icon-button--marker" :class="{'text-icon-button--active': locationDialogVisible}" buttonType="button">Change Location</base-text-icon-button>
        <base-text-icon-button @click="displaySettingsDialog('Delete Account')" mode="text-icon-button text-icon-button--trash" :class="{'text-icon-button--active': deleteAccountDialogVisible || confirmDeleteAccountDialogVisible}" buttonType="button">Delete Account</base-text-icon-button>
      </div>
    </div>
    <span class="toast-notification" :class="{'toast-notification--active' :nameUpdatedToast}" >Name updated</span>
    <span class="toast-notification" :class="{'toast-notification--active' :locationUpdatedToast}" >Location updated</span>
    <span class="toast-notification" :class="{'toast-notification--active' :passwordUpdatedToast}" >Password updated</span>
    <!-- <span class="toast-notification" :class="{'toast-notification--active' :avatarAddedToast}" >Image uploaded</span>
    <span class="toast-notification" :class="{'toast-notification--active' :avatarDeletedToast}" >Image deleted</span> -->


  </main>
</template>

<script>
import axios from 'axios';
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
      profileDataLoading: false,
      imageUploading: false,
      photoDialogVisible: false,
      passwordDialogVisible: false,
      locationDialogVisible: false,
      nameDialogVisible: false,
      deleteAccountDialogVisible: false,
      confirmDeleteAccountDialogVisible: false,
      profileID: "",
      profileName: "",
      profileEmail: "",
      profileLocation: "",
      profileImageURL: "",
      avatarImageURL: "",
      profilePlayerEmbed: "",
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      newLocation: '',
      newName: '',
      passwordMismatch: false,
      incorrectPassword: false,
      nameUpdatedToast: false,
      locationUpdatedToast: false,
      passwordUpdatedToast: false,
      // avatarAddedToast: false,
      // avatarDeletedToast: false,

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
      this.profileName = this.newName;
      axios
        .post("/api/profile_update", {
          name: this.newName,
          email: this.profileEmail,
          location: this.profileLocation,
          embed_url: this.profilePlayerEmbed,
          avatar_url: this.avatarImageURL,
          image_url: this.profileImageURL,
        })
        .then((res) => {
          console.log(res);

          if(res.data == "Profile Updated"){
            this.nameUpdatedToast = true;
            setTimeout(() => {
              this.nameUpdatedToast = false;
            }, 3000)
          }
        });
      this.newName = '';
      this.nameDialogVisible = false
    },
    submitLocation(){
      this.profileLocation = this.newLocation;
      axios
        .post("/api/profile_update", {
          name: this.profileName,
          email: this.profileEmail,
          location: this.newLocation,
          embed_url: this.profilePlayerEmbed,
          image_url: this.profileImageURL,
          avatar_url: this.avatarImageURL,
        })
        .then((res) => {
          console.log(res);

          if(res.data == "Profile Updated"){
            this.locationUpdatedToast = true;
            setTimeout(() => {
              this.locationUpdatedToast = false;
            }, 3000)
          }
        });
      this.newLocation = '';
      this.locationDialogVisible = false
    },

     uploadImage(event){
      const formData = new FormData;
      formData.append('file', event.target.files[0]);
      formData.append('upload_preset', 'vfbrvxkj');
      this.avatarImageURL = "";
      this.imageUploading = true;
      axios.post('https://api.cloudinary.com/v1_1/dgddraffq/image/upload', formData)
        .then((res) => {
          let publicID = res.data.public_id;
          this.imageUploading = false;
          this.avatarImageURL = "https://res.cloudinary.com/dgddraffq/image/upload/f_auto,q_auto:best,c_fill,g_faces/v1648123420/"+publicID+".jpg";
          this.$store.commit('setAvatarImage', this.avatarImageURL);
           axios
            .post("/api/add_avatar", {
              url: this.avatarImageURL,
            })
            .then((res) => {
              console.log(res);
              // if(res.data == "Url avatarded"){
              //   this.avatarAddedToast = true;
              //   setTimeout(() => {
              //     this.avatarAddedToast = false;
              //   }, 3000)
              // }
            });

      });
    },
    deleteAvatar(){
      this.$store.commit('deleteAvatarImage');
      this.avatarImageURL = '';
      axios
        .get("/api/delete_avatar")
        .then((res) => {
          console.log(res);
          // if(res.data == "Url unavatarded"){
          //     this.avatarDeletedToast = true;
          //     setTimeout(() => {
          //       this.avatarDeletedToast = false;
          //     }, 3000)
          //   }
        });
    },
    setNewPassword(){
      if(this.newPassword != this.confirmPassword && this.newPassword != ""){
        this.passwordMismatch = true;
      }else{
        this.passwordMismatch = false;        
        axios
        .post("/api/update_user_password",{
          old_password: this.currentPassword,
          password: this.newPassword
        })
        .then((res) => {
          console.log(res);
          if(res.data == "Old Password does not match"){
            this.incorrectPassword = true;
          }else{
            this.incorrectPassword = false;
            this.passwordDialogVisible = false;
            this.currentPassword = "";
            this.newPassword = "";
            this.confirmPassword = "";
          }
          if(res.data == "Password updated"){
            this.passwordUpdatedToast = true;
            setTimeout(() => {
              this.passwordUpdatedToast = false;
            }, 3000)
          }
          
        });
      }
    },
    confirmAccountDeletion(){
      axios
        .get("/api/delete_account")
        .then((res) => {
          console.log(res);
          this.$store.commit('logout');
          this.confirmDeleteAccountDialogVisible = false
          this.$router.push('/registration');
        });
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  },

  mounted() {
    this.profileDataLoading = true;
    axios.get("/api/profile/" + this.$store.state.userID).then((res) => {
      this.profileID = res.data.id;
      this.profileName = res.data.name;
      this.profileEmail = res.data.email;
      this.profileImageURL = res.data.image_url;
      this.avatarImageURL = res.data.avatar_url;
      this.profilePlayerEmbed = res.data.embed_url;
      this.profileLocation = res.data.location;
      this.profileDataLoading = false;
    });
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
      text-transform: capitalize;
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

  .avatar-image-thumb-container{
    margin-top:$spacing-s;
    display: flex;
    justify-content: center;
    padding:$spacing-s;
    background: $lightgrey;
    border-radius: $border-radius-reg;
  }

  .avatar-image-thumb{
    background: #fff;
    height: rem(200);
    width: rem(200);
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: rem(1) dashed $mid-grey;

    img{
      width: 100%;
    }
  }

  .avatar-image-uploading{
    width: 100%;
    height: 100%;
    padding: $spacing-s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $copy-mobile-s;

    @media(min-width:$desktop){
      font-size: $copy-desktop-xs;
    }

    .spinner{
      margin-right: $spacing-xs;
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

  .password-mismatch,
  .incorrect-password{
    margin-top:$spacing-m;
  }


</style>
