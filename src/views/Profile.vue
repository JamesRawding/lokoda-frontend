<template>
  <main class="page-container">
    <the-header></the-header>
    <section class="hero-section">
      <div class="hero-section__image-block">
        <div class="hero-section__image-container" v-if="profileImageURL">
          <img :src="profileImageURL" :alt="profileName + ' profile image'">
          <base-icon-button v-if="$store.state.loggedIn && userID == profileID" @click="displaySettingsDialog('Hero Image')" mode="icon-button icon-button--edit icon-button--round" ariaLabel="edit image"></base-icon-button>
        </div>
        <div v-else-if="$store.state.loggedIn && userID == profileID">
          <base-text-icon-button @click="displaySettingsDialog('Hero Image')" mode="text-icon-button text-icon-button--plus">Add Image</base-text-icon-button>
        </div>
        <transition>
        <base-dialog mode="modal-dialog" v-if="heroDialogVisible"  @closeDialog="hideSettingsDialog('Hero Image')">
          <strong>Select Image</strong>
          <div class="hero-image-thumb">
            <div v-if="!profileImageURL && !imageUploading">Add image below</div>
            <div v-if="imageUploading" class="hero-image-uploading"><span class="spinner"></span>Image Uploading</div>
            <img v-if="profileImageURL" :src="profileImageURL" :alt="profileName + ' profile image'">
          </div>
          <form @submit.prevent="submitForm">
            <choose-file-button @change="uploadImage" fileUploadID="uploadImage" fileUploadName="filename">
              Choose New Image
            </choose-file-button>
            <base-text-icon-button @click="deleteHero" mode="text-icon-button text-icon-button--trash" buttonType="button">Delete Image</base-text-icon-button>
            <base-button @click="hideSettingsDialog('Hero Image')" buttonType="submit" mode="cta cta--primary">Save</base-button>
          </form>
        </base-dialog>
        </transition>
      </div>

      <div class="hero-section__details">
        <h1>{{profileName}}</h1>
        <p>{{profileLocation}}</p>

        <div class="hero-section__genres" v-if="profileGenres.length">
          <base-pill v-for="genre in profileGenres" :key="genre + profileName">
            {{genre.genre}}
          </base-pill>
          <base-icon-button v-if="$store.state.loggedIn && userID == profileID" @click="displaySettingsDialog('Genres')" mode="icon-button icon-button--edit icon-button--round" ariaLabel="edit genres"></base-icon-button>
        </div>
        <div class="hero-section__genres" v-else-if="$store.state.loggedIn && userID == profileID">
          <base-text-icon-button  @click="displaySettingsDialog('Genres')" mode="text-icon-button text-icon-button--plus">Add Genres</base-text-icon-button>
        </div>
        <transition>
        <base-dialog mode="modal-dialog" v-if="genresDialogVisible"  @closeDialog="hideSettingsDialog('Genres')">
          <strong class="display-block">Select Genres</strong>
          <base-pill-button buttonType="button" @click="selectGenres(genre)" :class="{'pill-button--selected': selectedProfileGenres(genre)}" mode="pill-button pill-button--default" v-for="genre in allGenres" :key="genre">
            {{genre.genre}}
          </base-pill-button>
          <base-button @click="hideSettingsDialog('Genres')" buttonType="button" mode="cta cta--primary">Save</base-button>
        </base-dialog>
        </transition>

        <router-link @click="createNewContact" v-if="$store.state.loggedIn && userID != profileID" class="cta-secondary-reverse" :to="{name:'Messages', params: {profileID} }">Get In Touch</router-link>
        <a v-if="!$store.state.loggedIn" class="fallback-mailto" :href="'mailto:'+ profileEmail">Get In Touch</a>

      </div> 
    </section>

    <div class="profile-body">

      <section class="player-embed-block" v-if="profilePlayerEmbed">
        <iframe :src="profilePlayerEmbed" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
        <base-icon-button v-if="$store.state.loggedIn && userID == profileID" @click="displaySettingsDialog('Embed Player')" mode="icon-button icon-button--edit icon-button--round" ariaLabel="edit music player embed"></base-icon-button>
      </section>
      <div class="add-player-embed" v-else-if="$store.state.loggedIn && userID == profileID">
        <base-text-icon-button @click="displaySettingsDialog('Embed Player')" mode="text-icon-button text-icon-button--plus">Embed Music Player</base-text-icon-button>
        <span>e.g. Spotify, Soundcloud, Bandcamp etc</span>
      </div>
      <transition>
      <base-dialog mode="modal-dialog" v-if="embedDialogVisible"  @closeDialog="hideSettingsDialog('Embed Player')">
        <base-input inputId="playerEmbed" inputType="text" v-model="profilePlayerEmbed" :isRequired="false" >
          <template #label>Embed Music Player</template>
          <template #helpertext>Enter embed code From Soundcloud, Bandcamp, Spotify etc</template>
        </base-input>
        <base-button @click="hideSettingsDialog('Embed Player')" buttonType="button" mode="cta cta--primary">Save</base-button>
      </base-dialog>
      </transition>
      <section class="upcoming-shows" v-if="profileShows.length">
        <h2>Upcoming Shows</h2>
        <base-icon-button v-if="$store.state.loggedIn && userID == profileID" @click="displaySettingsDialog('Manage Shows')" buttonType="button" mode="icon-button icon-button--edit icon-button--round" ariaLabel="edit shows"></base-icon-button>
        <show-card @editThisShow="editShow(show)" @deleteThisShow="deleteShow(show)" v-for="show in profileShows" :key="show">
          <template #month>{{show.showMonth}}</template>
          <template #day>{{show.showDay}}</template>
          <template #year>{{show.showYear}}</template>
          <template #city>{{show.city}}</template>
          <template #venue>{{show.venue}}</template>
        </show-card>
        <base-text-icon-button v-if="profileShows.length > 3" @click="toggleShowListings" mode="text-icon-button text-icon-button--list" buttonType="button"> <span v-if="fullListingVisible">Hide Full Listing</span><span v-else>View Full Listing</span></base-text-icon-button>

      </section>
      <div class="add-upcoming-shows" v-else-if="$store.state.loggedIn && userID == profileID">
        <base-text-icon-button @click="displaySettingsDialog('Manage Shows')" buttonType="button" mode="text-icon-button text-icon-button--plus">Add and edit shows</base-text-icon-button>
      </div>


      <transition>
      <base-dialog mode="modal-dialog" v-if="showsDialogVisible"  @closeDialog="hideSettingsDialog('Manage Shows')">
        <strong>Manage Shows</strong>
        <base-text-icon-button @click="displaySettingsDialog('Add Show')" mode="text-icon-button text-icon-button--plus" buttonType="button">Add Show</base-text-icon-button>
        <div class="show-container">
          <show-card @editThisShow="editShow(show)" @deleteThisShow="deleteShow(show)" v-for="show in profileShowsResults" :key="show">
            <template #month>{{show.showMonth}}</template>
            <template #day>{{show.showDay}}</template>
            <template #year>{{show.showYear}}</template>
            <template #city>{{show.showCity}}</template>
            <template #venue>{{show.showVenue}}</template>
          </show-card>
        </div>
        <base-text-icon-button v-if="profileShows.length > 3" @click="toggleShowListings" mode="text-icon-button text-icon-button--list" buttonType="button"> <span v-if="fullListingVisible">Hide Full Listing</span><span v-else>View Full Listing</span></base-text-icon-button>

        <base-button @click="hideSettingsDialog('Manage Shows')" buttonType="button" mode="cta cta--primary">Save</base-button>
      </base-dialog>
      </transition>
      <transition>
      <base-dialog mode="modal-dialog modal-dialog--add-show" v-if="addShowDialogVisible"  @closeDialog="hideSettingsDialog('Add Show')">
        <strong>Enter Show Details</strong>
        <form @submit.prevent="submitShowForm">
          <base-input inputId="showCity" inputType="text" v-model="showCity" :isRequired="true" >
            <template #label>City</template>
          </base-input>
          <base-input inputId="showVenue" inputType="text" v-model="showVenue" :isRequired="true" >
            <template #label>Venue</template>
          </base-input>
          <fieldset class="add-show-date-fields">
            <legend>Select Date<span>(required)</span></legend>
            <span class="legend-helper">e.g. 02/08/2022</span>
            <div class="add-show-date-fields__inner">
              <base-input inputId="showDay" inputType="text" inputPattern="[0-9]*" inputMode="numeric" v-model="showDay" :isRequired="true" >
              <template #label>Day</template>
              </base-input>
              <base-input inputId="showMonth" inputType="text" inputPattern="[0-9]*" inputMode="numeric" v-model="showMonth" :isRequired="true" >
                <template #label>Month</template>
              </base-input>
              <base-input inputId="showYear" inputType="text" inputPattern="[0-9]*" inputMode="numeric" v-model="showYear" :isRequired="true" >
                <template #label>Year</template>
              </base-input>
            </div>
          </fieldset>
          <base-button buttonType="submit" mode="cta cta--primary">Save Show</base-button>
        </form>
      </base-dialog>
      </transition>
      <transition>
      <base-dialog mode="modal-dialog modal-dialog--add-show" v-if="editShowDialogVisible"  @closeDialog="hideSettingsDialog('Edit Show')">
        <strong>Edit Show Details</strong>
        <form @submit.prevent="submitEditShowForm">
          <base-input inputId="editShowCity" inputType="text" v-model="selectedShow.showCity" :isRequired="true" >
            <template #label>City</template>
          </base-input>
          <base-input inputId="editShowVenue" inputType="text" v-model="selectedShow.showVenue" :isRequired="true" >
            <template #label>Venue</template>
          </base-input>
          <fieldset class="add-show-date-fields">
            <legend>Select Date <span>(required)</span></legend>
            <span class="legend-helper">e.g. 02/08/2022</span>
            <div class="add-show-date-fields__inner">
              <base-input inputId="editShowDay" inputType="text" inputPattern="[0-9]*" inputMode="numeric"  v-model="selectedShow.showDay" :isRequired="true" >
                <template #label>Day</template>
              </base-input>
              <base-input inputId="editShowMonth" inputType="text" inputPattern="[0-9]*" inputMode="numeric"  v-model="selectedShow.showMonth" :isRequired="true" >
                <template #label>Month</template>
              </base-input>
              <base-input inputId="editShowYear" inputType="text" inputPattern="[0-9]*" inputMode="numeric"  v-model="selectedShow.showYear" :isRequired="true" >
                <template #label>Year</template>
              </base-input>
            </div>
          </fieldset>
          <base-button buttonType="submit" mode="cta cta--primary">Save Show</base-button>
        </form>
      </base-dialog>
      </transition>
      <transition>
      <base-dialog mode="modal-dialog modal-dialog--warning modal-dialog--delete-show" v-if="deleteShowDialogVisible"  @closeDialog="hideSettingsDialog('Delete Show')">
        <strong>Are you sure you want to delete this show?</strong>
        <p><span class="display-block">{{selectedShow.showVenue}}</span>
        <span class="display-block">{{selectedShow.showDay}} {{selectedShow.showMonth}} {{selectedShow.showYear}}</span></p>
        <div class="dialog-cta-container">
          <base-button @click="hideSettingsDialog('Delete Show')" buttonType="button" mode="cta cta--secondary">Cancel</base-button>
          <base-button @click="confirmDeleteShow" buttonType="button" mode="cta cta--warning">Delete</base-button>
        </div>
      </base-dialog>
      </transition>
    </div>

  </main>
</template>

<script>
import axios from 'axios';
import vClickOutside from 'click-outside-vue3'
import TheHeader from '../components/layouts/TheHeader.vue';
import BaseTextIconButton from '../components/UI/BaseTextIconButton.vue';
import BaseDialog from '../components/UI/BaseDialog.vue';
import ChooseFileButton from '../components/UI/ChooseFileButton.vue';
import BaseButton from '../components/UI/BaseButton.vue';
import BaseIconButton from '../components/UI/BaseIconButton.vue';
import BasePill from '../components/UI/BasePill.vue';
import BasePillButton from '../components/UI/BasePillButton.vue';
import BaseInput from '../components/UI/BaseInput.vue';
import ShowCard from '../components/UI/ShowCard.vue';
export default {
  components:{
    TheHeader,
    BaseTextIconButton,
    BaseDialog,
    ChooseFileButton,
    BaseButton,
    BaseIconButton,
    BasePill,
    BasePillButton,
    BaseInput,
    ShowCard
  }, 
  data() {
    return{
      userID: this.$store.state.userID,
      imageUploading: false,
      profileURL: this.$store.state.userID,
      profileID: '',
      profileName: '',
      profileEmail: '',
      profileLocation: '',
      profileContactDetails:[],
      profileImageURL: '',
      profileGenres: [],
      profileShows: [],
      profilePlayerEmbed: '',
      allGenres:[],
      heroDialogVisible: false,
      genresDialogVisible: false,
      embedDialogVisible: false,
      showsDialogVisible: false,
      deleteShowDialogVisible: false,
      addShowDialogVisible: false,
      editShowDialogVisible: false,
      fullListingVisible: false,
      selectedShow: '',
      selectedShowIndex: '',
      showDay: '',
      showMonth: '',
      showYear: '',
      showCity: '',
      showVenue: '',
    }
    
  },
  methods:{
    createNewContact(){
      this.$store.commit({
        type: 'createNewContact',
        contactID: this.profileID,
        contactName: this.profileName,
        contactProfilePic: this.profileImageURL
      })

    },
     displaySettingsDialog(evt){
      if(evt == 'Hero Image'){
        this.heroDialogVisible = true
      }
      if(evt == 'Genres'){
        this.genresDialogVisible = true
      }
      if(evt == 'Embed Player'){
        this.embedDialogVisible = true
      }
      if(evt == 'Manage Shows'){
        this.showsDialogVisible = true
      }
      if(evt == 'Add Show'){
        this.addShowDialogVisible = true;
        this.showsDialogVisible = false
      }
    },
    hideSettingsDialog(evt){
      if(evt == 'Hero Image'){
        this.heroDialogVisible = false
      }
      if(evt == 'Genres'){
        this.genresDialogVisible = false
      }
      if(evt == 'Embed Player'){
        this.profilePlayerEmbed = this.profilePlayerEmbed.match(/\bhttps?:\/\/\S+/gi)[0];
        //this.profiles.find(profile => profile.profileName).profilePlayerEmbed = this.profilePlayerEmbed;
        axios.post('/add_embed_url', {
          url: this.profilePlayerEmbed,
        })
            .then((res) => {
                console.log(res);
                
            });
        this.embedDialogVisible = false
      }
      if(evt == 'Manage Shows'){
        this.showsDialogVisible = false
      }
      if(evt == 'Delete Show'){
        this.deleteShowDialogVisible = false
      }
      if(evt == 'Add Show'){
        this.addShowDialogVisible = false
      }
      if(evt == 'Edit Show'){
        this.editShowDialogVisible = false;
      }
    },
    selectGenres(evt){
      const genre = evt
      //console.log(genre)
      const selectedGenres = this.profileGenres;
      const index = selectedGenres.indexOf(evt);
       console.log(selectedGenres)
      // console.log(genre)
      
      
      if(selectedGenres.includes(genre)){
        if (index > -1) {
          selectedGenres.splice(index, 1);
        //   axios.delete('/add_genre', {
        //    user_id: this.userID, 
        //    genre_id: genre.id
        //  }).then((res) => {
        //     console.log(res);
        //  });
        }
      }else{
        selectedGenres.push(genre);
        //  axios.post('/add_genre', {
        //    user_id: this.userID, 
        //    genre_id: genre.id
        //  }).then((res) => {
        //     console.log(res);
        //  });
      }
    },
    submitShowForm(){
      const shows = this.profileShows;
      
      if(this.showDay.startsWith('0')){
        this.showDay = this.showDay.substring(1)
      }
      
      const month = this.showMonth;
      switch (month){
        case '01':
          this.showMonth = "Jan";
          break;
        case '02':
          this.showMonth = "Feb";
          break;
        case '03':
          this.showMonth = "Mar";
          break;
        case '04':
          this.showMonth = "Apr";
          break;
        case '05':
          this.showMonth = "May";
          break;
        case '06':
          this.showMonth = "Jun";
          break;
        case '07':
          this.showMonth = "Jul";
          break;
        case '08':
          this.showMonth = "Aug";
          break;
        case '09':
          this.showMonth = "Sep";
          break;
        case '10':
          this.showMonth = "Oct";
          break;
        case '11':
          this.showMonth = "Nov";
          break;
        case '12':
          this.showMonth = "Dec";
      }

      // if(!this.showYear.startsWith('20') && this.showYear.length != 3){
      //   this.showYear = '20'+this.showYear
      // }

      const newShow = {
        showDay: this.showDay,
        showMonth: this.showMonth,
        showYear: this.showYear,
        showCity: this.showCity,
        showVenue: this.showVenue,
      }

       axios.post('/add_show', {
           city: this.showCity,
           venue: this.showVenue,
           day: parseInt(this.showDay, 10),
           month: parseInt(month, 10),
           year: parseInt(this.showYear, 10),
       }).then((res) => {
           console.log(res);
       });

      shows.unshift(newShow);
      this.showDay = '';
      this.showMonth = '';
      this.showYear = '';
      this.showCity = '';
      this.showVenue = '';
      this.addShowDialogVisible = false

    },
    toggleShowListings(){
      this.fullListingVisible = !this.fullListingVisible
    },
    
    editShow(evt){
      const show = evt
      //const shows = this.profiles.find(profile => profile.profileName).profileShows = this.profileShows;
     const shows = this.profileShows;
     const index = shows.indexOf(evt);
     
      this.selectedShow = show;
      this.selectedShowIndex = index;
      console.log(this.selectedShow)
      // console.log(this.selectedShowIndex)
      // if(!show.showDay.startsWith('0') && show.showDay.length == 1){
      //   show.showDay = '0'+show.showDay
      // }
      const month = show.showMonth;
      switch (month){
        case 'Jan':
          show.showMonth = "01";
          break;
        case 'Feb':
          show.showMonth = "02";
          break;
        case 'Mar':
          show.showMonth = "03";
          break;
        case 'Apr':
          show.showMonth = "04";
          break;
        case 'May':
          show.showMonth = "05";
          break;
        case 'Jun':
          show.showMonth = "06";
          break;
        case 'Jul':
          show.showMonth = "07";
          break;
        case 'Aug':
          show.showMonth = "08";
          break;
        case 'Sep':
          show.showMonth = "09";
          break;
        case 'Oct':
          show.showMonth = "10";
          break;
        case 'Nov':
          show.showMonth = "11";
          break;
        case 'Dec':
          show.showMonth = "12";
      }

      this.editShowDialogVisible = true;
      this.showsDialogVisible = false
    },
    submitEditShowForm(){
       if(this.selectedShow.showDay.startsWith('0')){
        this.selectedShow.showDay = this.selectedShow.showDay.substring(1)
      }
      
      const month = this.selectedShow.showMonth;
      switch (month){
        case '01':
          this.selectedShow.showMonth = "Jan";
          break;
        case '02':
          this.selectedShow.showMonth = "Feb";
          break;
        case '03':
          this.selectedShow.showMonth = "Mar";
          break;
        case '04':
          this.selectedShow.showMonth = "Apr";
          break;
        case '05':
          this.selectedShow.showMonth = "May";
          break;
        case '06':
          this.selectedShow.showMonth = "Jun";
          break;
        case '07':
          this.selectedShow.showMonth = "Jul";
          break;
        case '08':
          this.selectedShow.showMonth = "Aug";
          break;
        case '09':
          this.selectedShow.showMonth = "Sep";
          break;
        case '10':
          this.selectedShow.showMonth = "Oct";
          break;
        case '11':
          this.selectedShow.showMonth = "Nov";
          break;
        case '12':
          this.selectedShow.showMonth = "Dec";
      }

      if(!this.selectedShow.showYear.startsWith('20') && this.selectedShow.showYear.length != 3){
        this.selectedShow.showYear = '20'+this.selectedShow.showYear
      }
      this.editShowDialogVisible = false
    },
    deleteShow(evt){
      const show = evt
      //const shows = this.profiles.find(profile => profile.profileName).profileShows = this.profileShows;
      const shows = this.profileShows;
      const index = shows.indexOf(evt);
      this.selectedShow = show;
      this.selectedShowIndex = index;
      this.deleteShowDialogVisible = true;
      this.showsDialogVisible = false
    },
    confirmDeleteShow(){
      const shows = this.profileShows;
      //const shows = this.profiles.find(profile => profile.profileName).profileShows = this.profileShows;
  console.log(shows);
  console.log(this.selectedShow)
  console.log(this.selectedShowIndex)
      if(shows.includes(this.selectedShow)){
        if (this.selectedShowIndex > -1) {
          shows.splice(this.selectedShowIndex, 1);
        }
      }
      this.deleteShowDialogVisible = false;
      this.selectedShow = '';
      this.selectedShowIndex = ''
    },

    uploadImage(event){
      const formData = new FormData;
      formData.append('file', event.target.files[0]);
      formData.append('upload_preset', 'vfbrvxkj');
      this.profileImageURL = "";
      this.imageUploading = true;
      axios.post('https://api.cloudinary.com/v1_1/dgddraffq/image/upload', formData)
        .then((res) => {
           let publicID = res.data.public_id;
           this.imageUploading = false;
           this.profileImageURL = "https://res.cloudinary.com/dgddraffq/image/upload/f_auto,q_auto:best,c_fill,g_faces/v1648123420/"+publicID+".jpg";
           //this.profiles.find(profile => profile.profileName).profileImageURL = this.profileImageURL;
           this.$store.commit('setHeroImage', this.profileImageURL);
      });
      axios.post('/add_image', {
          url: this.profileImageURL,
        })
            .then((res) => {
                console.log(res);
                
            });

    },

    deleteHero(){
      this.profileImageURL = '';
    },
    selectedProfileGenres(genre){
      for (let i = 0; i < this.profileGenres.length; i++) {
        let selectedGenres = this.profileGenres[i].genre

        if(selectedGenres == genre.genre){
          return true;
        }
      }  
    }
    
  },
  computed:{
    profileShowsResults(){
      if(this.fullListingVisible == false){
        return this.profileShows.slice(0,3)
      }else{
        return this.profileShows
      }
    },
    
  },
    created(){
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  mounted(){
        //this.allGenres = this.$store.state.genres;
        const url = this.$route.params.profileURL;
        if(this.$store.state.userID == url){
          //console.log('token')
           axios.get('/get_user_genres').then((res) => {
              this.profileGenres = res.data;
              console.log(res.data)
              //this.$store.state.profile.profileGenres = res.data;
          });
          axios.get('/get_user_shows').then((res) => {
              this.profileShows = res.data;
              this.$store.state.profile.profileShows = res.data;
          });
        }else{
          //console.log('no token')
          //  axios.get('/get_shows_for_profile',{ 
          //     params: { 
          //       id: url 
          //     } 
          //     }).then((res) => {
          //       console.log(res)
          //   });
        }
        //console.log(url);
        // axios.get('/profile').then((res) => {
        //     this.profileID = res.data.id;
        //     this.profileName = res.data.name;
        //     this.profileEmail = res.data.email;
        //     this.profileImageURL = res.data.image_url;
        //     this.profilePlayerEmbed = res.data.embed_url;
        //     this.profileLocation = res.data.location;
        //     //console.log(res)
        // });
      

      


        axios.get('/profile/' + url).then((res) => {
          console.log(res.data)
            this.profileID = res.data.id;
            this.profileName = res.data.name;
            this.profileEmail = res.data.email;
            this.profileImageURL = res.data.image_url;
            this.profilePlayerEmbed = res.data.embed_url;
            this.profileLocation = res.data.location;
       });

       axios.get('/get_genres').then((res) => {
            this.allGenres = res.data
        });
  }

}
</script>

<style lang="scss" scoped>
  .hero-section{
    background-color: $dark-green;
    width:calc(100% + $spacing-m);
    margin: $spacing-s rem(-16) 0 rem(-16);

    @media(min-width:$desktop){
      margin: $spacing-m 0 0 0;
      width: 100%;
      display: grid;
      grid-template-columns: 5fr 7fr;
      border-radius: $border-radius-reg;
    }

    &__details{
      padding: $spacing-s;

      @media(min-width:$desktop){
        padding:$spacing-l;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }

    h1,p{
      color: #fff;
    }

    p{
      margin-top:$spacing-xs;
      &:before{
        content: '\f3c5';
        font-family: "Font Awesome 5 Pro";
        margin-right: $spacing-xs;
        font-weight: 300;
      }
    }

    &__image-block{
      background-color: $lightgrey;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      max-height: rem(200);
      overflow: hidden;

      @media(min-width:$desktop){
        order: 2;
        max-height: rem(400);
      }

      .icon-button{
        position:absolute;
        bottom: $spacing-s;
        right:$spacing-s;
      }
    }

    &__image-container{
      width:100%;
      img{
        width: 100%;
        vertical-align: bottom;
      }
    }

    &__genres{
      margin-top:$spacing-s;
      width: 100%;
      position: relative;

      .icon-button{
        position: absolute;
        bottom: 0;
        right:0;

        @media(min-width:$desktop){
          right: rem(-32);
        }
      }
      
      .text-icon-button{
        color: #fff;
      }
    }

    .cta-secondary-reverse{
      text-decoration: none;
      margin-top:$spacing-m;
      @include cta;
      @include cta--secondary-reverse;

      @media(min-width:$desktop){
        align-self: flex-start;
      }
    }
  }

  .fallback-mailto{
    color:#fff;
    position: relative;
    padding-left: rem(33);
    margin-top: $spacing-l;
    display: block;

    @media(min-width:$desktop){
      padding-left: rem(41);
    }

    &:before{
      position: absolute;
      font-family: "Font Awesome 5 Pro";
      font-weight: 300;
      margin-right: $spacing-xs;
      width: rem(25);
      text-align: center;
      content:'\f0e0';
      text-decoration: underline;
      left: 0;
      top: rem(3);
      

      @media(min-width:$desktop){
        margin-right: $spacing-s;
        top: rem(2);
      }
    }

    &:before{
      text-decoration: none;
    }
  }

  .profile-body{
    @media(min-width:$desktop){
      display: grid;
      grid-template-columns: 8fr 4fr;
      grid-column-gap: $spacing-m;
    }
  }

  .add-player-embed{
    background-color: $lightgrey;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    position: relative;
    height: rem(200);
    width:calc(100% + $spacing-m);
    margin: 0 rem(-16);
    padding: $spacing-s;

    @media(min-width:$desktop){
      order:2;
      margin: $spacing-m 0 0 0;
      padding: $spacing-m;
      width: 100%;
      border-radius: $border-radius-reg;
    }

    span{
      font-size: $copy-mobile-s;
      line-height: 1.5;
      @media(min-width:$desktop){
        font-size: $copy-desktop-s;
      }
    }
  }

  .player-embed-block{
    position: relative;
    padding: $spacing-m 0;
    @media(min-width:$desktop){
      order:2;
    }

    .icon-button{
      position: absolute;
      top: $spacing-m;
      right:0;
    }
  }

  .add-upcoming-shows{
    background-color: $lightgrey;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    position: relative;
    height: rem(200);
    width:calc(100% + $spacing-m);
    margin: 0 rem(-16);
    padding: $spacing-s;
    border-top: rem(1) solid $dark-green;

    @media(min-width:$desktop){
      border-top:none;
      margin: $spacing-m 0 0 0;
      padding: $spacing-m;
      width: 100%;
      border-radius: $border-radius-reg;
    }
  }

   .modal-dialog--add-show{
    .input-container:first-of-type{
      margin-top:$spacing-m; 
    }
  }

  .add-show-date-fields{
    margin-top:$spacing-m;

    legend{
      font-weight: bold;
      span{
        font-size: $copy-mobile-s;
        font-weight: normal;
        margin-left: $spacing-s;

        @media(min-width:$desktop){
          font-size: $copy-desktop-s;
        }
      }
    }

    &__inner{
      display:grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: $spacing-m;
    }

    .legend-helper{
      @include baseLabelHelper;
    }

    label span{
      display: none;
    }
  }

  .show-container{
    max-height: rem(280);
    overflow: auto;

    @media(min-width:$desktop){
      max-height: rem(400);
    }
  }

  .upcoming-shows{
    position: relative;
    margin-top: $spacing-m;

    .icon-button{
      position: absolute;
      top: 0;
      right:0;
    }

    .text-icon-button--list{
      margin-top:$spacing-m;
    }
  }

  dialog .cta--primary{
    margin: 2rem auto 0 auto;
    display: block;
  }

  .dialog-inner{
    .text-icon-button--list{
      margin-top:$spacing-s;
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

  .modal-dialog--delete-show{

    strong{
      @media(min-width:$desktop){
        display: block;
        padding: 0 $spacing-m;
      } 
    }
    p{
      margin-top:$spacing-s;
    }
  }

  .hero-image-thumb{
    margin-top:$spacing-s;
    height: rem(200);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: rem(1) dashed $mid-grey;

    @media(min-width:$desktop){
     height: rem(250);
    }

    img{
      width: 100%;
    }
  }

  .hero-image-uploading{
    width: 100%;
    height: 100%;
    padding: $spacing-m;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pill-button:before{
    font-family: "Font Awesome 5 Pro";
    font-weight: 300;
    content: '\f067';
    margin-right: $spacing-xs;
  }

  .pill-button--selected:before{
    content: '\f068';
  }

</style>
