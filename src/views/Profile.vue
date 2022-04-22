<template>
  <main
    class="page-loading-message"
    v-if="profileDataLoading || profileShowsLoading"
  >
    <div><span class="spinner"></span>Profile loading</div>
  </main>
  <main v-else class="page-container">
    <the-header></the-header>
    <section class="hero-section">
      <div class="hero-section__image-block" :class="{'hero-section__image-block--no-image': !profileImageURL}">
        <div class="hero-section__image-container" v-if="profileImageURL">
          <img :src="profileImageURL" :alt="profileName + ' profile image'" />
          <base-icon-button
            v-if="$store.state.loggedIn && userID == profileID"
            @click="displaySettingsDialog('Hero Image')"
            mode="icon-button icon-button--edit icon-button--round"
            ariaLabel="edit image"
          ></base-icon-button>
        </div>
        <div v-else-if="$store.state.loggedIn && userID == profileID">
          <base-text-icon-button
            @click="displaySettingsDialog('Hero Image')"
            mode="text-icon-button text-icon-button--plus"
            >Add Image</base-text-icon-button
          >
        </div>
        <transition>
          <base-dialog
            mode="modal-dialog"
            v-if="heroDialogVisible"
            @closeDialog="hideSettingsDialog('Hero Image')"
          >
            <strong>Select Image</strong>
            <div class="hero-image-thumb">
              <div v-if="!profileImageURL && !imageUploading">
                Add image below
              </div>
              <div v-if="imageUploading" class="hero-image-uploading">
                <span class="spinner"></span>Image Uploading
              </div>
              <img
                v-if="profileImageURL"
                :src="profileImageURL"
                :alt="profileName + ' profile image'"
              />
            </div>
            <form @submit.prevent="submitForm">
              <choose-file-button
                @change="uploadImage"
                fileUploadID="uploadImage"
                fileUploadName="filename"
              >
                Choose New Image
              </choose-file-button>
              <base-text-icon-button
                @click="deleteHero"
                mode="text-icon-button text-icon-button--trash"
                buttonType="button"
                >Delete Image</base-text-icon-button
              >
              <base-button
                @click="hideSettingsDialog('Hero Image')"
                buttonType="submit"
                mode="cta cta--primary"
                >Save</base-button
              >
            </form>
          </base-dialog>
        </transition>
      </div>

      <div class="hero-section__details">
        <h1>{{ profileName }}</h1>
        <p>{{ profileLocation }}</p>

        <div class="hero-section__genres" v-if="profileGenres.length">
          <base-pill v-for="genre in profileGenres" :key="genre">
            {{ genre.genre }}
          </base-pill>
          <base-icon-button
            v-if="$store.state.loggedIn && userID == profileID"
            @click="displaySettingsDialog('Genres')"
            mode="icon-button icon-button--edit icon-button--round"
            ariaLabel="edit genres"
          ></base-icon-button>
        </div>
        <div
          class="hero-section__genres"
          v-else-if="$store.state.loggedIn && userID == profileID"
        >
          <base-text-icon-button
            @click="displaySettingsDialog('Genres')"
            mode="text-icon-button text-icon-button--plus"
            >Add Genres</base-text-icon-button
          >
        </div>
        <transition>
          <base-dialog
            mode="modal-dialog"
            v-if="genresDialogVisible"
            @closeDialog="hideSettingsDialog('Genres')"
          >
            <strong class="display-block">Select Genres</strong>
            <base-pill-button
              buttonType="button"
              @click="selectGenres(genre)"
              :class="{ 'pill-button--selected': selectedProfileGenres(genre) }"
              mode="pill-button pill-button--default"
              v-for="genre in allGenres"
              :key="genre.genre"
            >
              {{ genre.genre }}
            </base-pill-button>
            <base-button
              @click="hideSettingsDialog('Genres')"
              buttonType="button"
              mode="cta cta--primary"
              >Save</base-button
            >
          </base-dialog>
        </transition>

        <router-link
          @click="createNewContact"
          v-if="$store.state.loggedIn && userID != profileID"
          class="cta-secondary-reverse"
          :to="{ name: 'Messages', params: { profileID } }"
          >Get In Touch</router-link
        >
        <a
          v-if="!$store.state.loggedIn"
          class="fallback-mailto"
          :href="'mailto:' + profileEmail"
          >Get In Touch</a
        >
      </div>
    </section>

    <div class="profile-body">
      <section class="player-embed-block" v-if="profilePlayerEmbed">
        <iframe
          :src="profilePlayerEmbed"
          width="100%"
          height="380"
          frameBorder="0"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        ></iframe>
        <base-icon-button
          v-if="$store.state.loggedIn && userID == profileID"
          @click="displaySettingsDialog('Embed Player')"
          mode="icon-button icon-button--edit icon-button--round"
          ariaLabel="edit music player embed"
        ></base-icon-button>
      </section>
      <div
        class="add-player-embed"
        v-else-if="$store.state.loggedIn && userID == profileID"
      >
        <base-text-icon-button
          @click="displaySettingsDialog('Embed Player')"
          mode="text-icon-button text-icon-button--plus"
          >Embed Music Player</base-text-icon-button
        >
        <span>e.g. Spotify, Soundcloud, Bandcamp etc</span>
      </div>
      <transition>
        <base-dialog
          mode="modal-dialog"
          v-if="embedDialogVisible"
          @closeDialog="hideSettingsDialog('Embed Player')"
        >
          <base-input
            inputId="playerEmbed"
            inputType="text"
            v-model="profilePlayerEmbed"
            :isRequired="false"
          >
            <template #label>Embed Music Player</template>
            <template #helpertext
              >Enter embed code From Soundcloud, Bandcamp, Spotify etc</template
            >
          </base-input>
          <base-text-icon-button
            @click="deleteEmbed"
            mode="text-icon-button text-icon-button--trash"
            buttonType="button"
            >Delete Embed</base-text-icon-button
          >
          <base-button
            @click="hideSettingsDialog('Embed Player')"
            buttonType="button"
            mode="cta cta--primary"
            >Save</base-button
          >
        </base-dialog>
      </transition>
      <section class="upcoming-shows" v-if="profileShows.length">
        <h2>Upcoming Shows</h2>
        <base-icon-button
          v-if="$store.state.loggedIn && userID == profileID"
          @click="displaySettingsDialog('Manage Shows')"
          buttonType="button"
          mode="icon-button icon-button--edit icon-button--round"
          ariaLabel="edit shows"
        ></base-icon-button>
        <show-card
          tabindex="0"
          @click="fullShowDetails(show)"
          @editThisShow="editShow(show)"
          @deleteThisShow="cancelShow(show)"
          v-for="show in profileShowsResults"
          :key="show.venue+show.id"
        >
          <template #month>{{ convertedMonth(show) }}</template>
          <template #day>{{ convertedDay(show) }}</template>
          <template #year>{{ convertedYear(show) }}</template>
          <template #city>{{ show.city }}</template>
          <template #venue>{{ show.venue }}</template>
          <template #time>{{ show.time }}</template>
          <template v-if="show.status == 'CANCELLED'" #status><span class="show-card__cancelled">Show Cancelled</span></template>
        </show-card>

        <transition>
        <base-dialog
          mode="modal-dialog"
          v-if="fullShowDetailsVisible"
          @closeDialog="hideSettingsDialog('Full Show Details')"
        >
        <section class="full-show-details">
          <h2>Full Show Details</h2>
          <span class="full-show-details__cancelled" v-if="selectedFullShowListing.status === 'CANCELLED'">Show Cancelled</span>
          <span class="full-show-details__info"><strong>City: </strong>{{selectedFullShowListing.city}}</span>
          <span class="full-show-details__info"><strong>Venue: </strong>{{selectedFullShowListing.venue}}</span>
          <span class="full-show-details__info"><strong>Date: </strong>{{ convertedDay(selectedFullShowListing) }} {{ convertedMonth(selectedFullShowListing) }} {{ convertedYear(selectedFullShowListing) }}</span>
          <span class="full-show-details__info"><strong>Time: </strong>{{selectedFullShowListing.time}}</span>
          <span class="full-show-details__info"><strong>Comments: </strong>{{selectedFullShowListing.comments}}</span>
        </section>

          
        </base-dialog>
      </transition>
        
        <base-text-icon-button
          v-if="profileShows.length > 3"
          @click="toggleShowListings"
          mode="text-icon-button text-icon-button--list"
          buttonType="button"
        >
          <span v-if="fullListingVisible">Hide Full Listing</span
          ><span v-else>View Full Listing</span></base-text-icon-button
        >
      </section>
      <div
        class="add-upcoming-shows"
        v-else-if="$store.state.loggedIn && userID == profileID"
      >
        <base-text-icon-button
          @click="displaySettingsDialog('Manage Shows')"
          buttonType="button"
          mode="text-icon-button text-icon-button--plus"
          >Add and edit shows</base-text-icon-button
        >
      </div>
      <section class="upcoming-shows" v-else>
        <h2>No Shows Booked</h2>
        <p>There are no future shows as of yet.</p>
      </section>

      <transition>
        <base-dialog
          mode="modal-dialog"
          v-if="showsDialogVisible"
          @closeDialog="hideSettingsDialog('Manage Shows')"
        >
          <strong>Manage Shows</strong>
          <base-text-icon-button
            @click="displaySettingsDialog('Add Show')"
            mode="text-icon-button text-icon-button--plus"
            buttonType="button"
            >Add Show</base-text-icon-button
          >
          <div class="show-container">
            <show-card
              @editThisShow="editShow(show)"
              @deleteThisShow="cancelShow(show)"
              v-for="show in profileShowsResults"
              :key="show.venue+show.id+'edit'"
            >
              <template #month>{{ convertedMonth(show) }}</template>
              <template #day>{{ convertedDay(show) }}</template>
              <template #year>{{ convertedYear(show) }}</template>
              <template #city>{{ show.city }}</template>
              <template #venue>{{ show.venue }}</template>
              <template #time>{{ show.time }}</template>
              <template v-if="show.status == 'CANCELLED'" #status><span class="show-card__cancelled">Show Cancelled</span></template>
            </show-card>
          </div>
          <base-text-icon-button
            v-if="profileShows.length > 3"
            @click="toggleShowListings"
            mode="text-icon-button text-icon-button--list"
            buttonType="button"
          >
            <span v-if="fullListingVisible">Hide Full Listing</span
            ><span v-else>View Full Listing</span></base-text-icon-button
          >

          <base-button
            @click="hideSettingsDialog('Manage Shows')"
            buttonType="button"
            mode="cta cta--primary"
            >Save</base-button
          >
        </base-dialog>
      </transition>
      <transition>
        <base-dialog
          mode="modal-dialog modal-dialog--add-show"
          v-if="addShowDialogVisible"
          @closeDialog="hideSettingsDialog('Add Show')"
        >
          <strong>Enter Show Details</strong>
          <form @submit.prevent="submitShowForm">
            <base-input
              inputId="showCity"
              inputType="text"
              v-model="city"
              :isRequired="true"
            >
              <template #label>City</template>
            </base-input>
            <base-input
              inputId="showVenue"
              inputType="text"
              v-model="venue"
              :isRequired="true"
            >
              <template #label>Venue</template>
            </base-input>
            <base-input
              inputId="showTime"
              inputType="text"
              v-model="time"
              :isRequired="true"
            >
              <template #label>Time</template>
              <template #helpertext>e.g. 7am/7pm.</template>

            </base-input>
            <fieldset class="add-show-date-fields">
              <legend>Select Date<span>(required)</span></legend>
              <span class="legend-helper">e.g. 02/08/2022</span>
              <div class="add-show-date-fields__inner">
                <base-input
                  inputId="showDay"
                  inputType="text"
                  inputPattern="[0-9]*"
                  inputMode="numeric"
                  v-model="day"
                  :isRequired="true"
                >
                  <template #label>Day</template>
                </base-input>
                <base-input
                  inputId="showMonth"
                  inputType="text"
                  inputPattern="[0-9]*"
                  inputMode="numeric"
                  v-model="month"
                  :isRequired="true"
                >
                  <template #label>Month</template>
                </base-input>
                <base-input
                  inputId="showYear"
                  inputType="text"
                  inputPattern="[0-9]*"
                  inputMode="numeric"
                  v-model="year"
                  :isRequired="true"
                >
                  <template #label>Year</template>
                </base-input>
              </div>
            </fieldset>
             <base-textarea
              inputId="showComments"
              v-model="comments"
              :isRequired="false">
              <template #label>Comments</template>
              <template #helpertext>e.g. Support acts</template>
            </base-textarea>
            <base-button buttonType="submit" mode="cta cta--primary"
              >Save Show</base-button
            >
          </form>
        </base-dialog>
      </transition>
      <transition>
        <base-dialog
          mode="modal-dialog modal-dialog--add-show"
          v-if="editShowDialogVisible"
          @closeDialog="hideSettingsDialog('Edit Show')"
        >
          <strong>Edit Show Details</strong>
          <form @submit.prevent="submitEditShowForm">
            <base-input
              inputId="editShowCity"
              inputType="text"
              v-model="selectedShow.city"
              :isRequired="true"
            >
              <template #label>City</template>
            </base-input>
            <base-input
              inputId="editShowVenue"
              inputType="text"
              v-model="selectedShow.venue"
              :isRequired="true"
            >
              <template #label>Venue</template>
            </base-input>
            <base-input
              inputId="showTime"
              inputType="text"
              v-model="selectedShow.time"
              :isRequired="true"
            >
              <template #label>Time</template>
              <template #helpertext>e.g. 7am/7pm.</template>

            </base-input>
            <fieldset class="add-show-date-fields">
              <legend>Select Date <span>(required)</span></legend>
              <span class="legend-helper">e.g. 02/08/2022</span>
              <div class="add-show-date-fields__inner">
                <base-input
                  inputId="editShowDay"
                  inputType="text"
                  inputPattern="[0-9]*"
                  inputMode="numeric"
                  v-model="selectedShow.day"
                  :isRequired="true"
                >
                  <template #label>Day</template>
                </base-input>
                <base-input
                  inputId="editShowMonth"
                  inputType="text"
                  inputPattern="[0-9]*"
                  inputMode="numeric"
                  v-model="selectedShow.month"
                  :isRequired="true"
                >
                  <template #label>Month</template>
                </base-input>
                <base-input
                  inputId="editShowYear"
                  inputType="text"
                  inputPattern="[0-9]*"
                  inputMode="numeric"
                  v-model="selectedShow.year"
                  :isRequired="true"
                >
                  <template #label>Year</template>
                </base-input>
              </div>
            </fieldset>
             <base-textarea
              inputId="showComments"
              v-model="selectedShow.comments"
              :isRequired="false">
              <template #label>Comments</template>
              <template #helpertext>e.g. Support acts</template>
            </base-textarea>
            <base-button buttonType="submit" mode="cta cta--primary"
              >Save Show</base-button
            >
          </form>
        </base-dialog>
      </transition>
      <transition>
        <base-dialog
          mode="modal-dialog modal-dialog--warning modal-dialog--cancel-show"
          v-if="cancelShowDialogVisible"
          @closeDialog="hideSettingsDialog('Cancel Show')"
        >
          <strong>Are you sure you want to cancel this show?</strong>
          <p>
            <span class="display-block">{{ selectedShow.showVenue }}</span>
            <span class="display-block"
              >{{ convertedDay(selectedShow) }} {{ convertedMonth(selectedShow) }}
              {{ convertedYear(selectedShow) }}</span
            >
          </p>
          <div class="dialog-cta-container">
            <base-button
              @click="hideSettingsDialog('Cancel Show')"
              buttonType="button"
              mode="cta cta--secondary"
              >Keep Show</base-button
            >
            <base-button
              @click="confirmCancelShow"
              buttonType="button"
              mode="cta cta--warning"
              >Cancel Show</base-button
            >
          </div>
        </base-dialog>
      </transition>
      

      
    </div>
    <section class="qr-section" v-if="$store.state.loggedIn && userID == profileID">
      <img :src="qrImage" :alt="profileName +'qr code'">
      <h3>Need to share your profile?</h3>
      <p>This QR code can be printed so you can display at your next show making it easier for your fans to find you.</p>
      <div v-if="printQRPage" class="qr-section__print-info">
        <h1>{{profileName}}</h1>
        <p>Discover on</p>
        <img src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo_izjrxu.svg" alt="lokoda logo">
      </div>
      <base-button
      v-if="!printQRPage"
      @click="printQRImage"
      buttonType="button"
      mode="cta cta--secondary"
      >Print QR Code
      </base-button>
      <base-button
      v-else
      @click="closePrintQRImage"
      buttonType="button"
      mode="cta cta--secondary"
      >Back to Profile
      </base-button>
    </section>
  </main>
  
</template>

<script>
import axios from "axios";
import vClickOutside from "click-outside-vue3";
import TheHeader from "../components/layouts/TheHeader.vue";
import BaseTextIconButton from "../components/UI/BaseTextIconButton.vue";
import BaseDialog from "../components/UI/BaseDialog.vue";
import ChooseFileButton from "../components/UI/ChooseFileButton.vue";
import BaseButton from "../components/UI/BaseButton.vue";
import BaseIconButton from "../components/UI/BaseIconButton.vue";
import BasePill from "../components/UI/BasePill.vue";
import BasePillButton from "../components/UI/BasePillButton.vue";
import BaseInput from "../components/UI/BaseInput.vue";
import BaseTextarea from "../components/UI/BaseTextarea.vue";
import ShowCard from "../components/UI/ShowCard.vue";
export default {
  components: {
    TheHeader,
    BaseTextIconButton,
    BaseDialog,
    ChooseFileButton,
    BaseButton,
    BaseIconButton,
    BasePill,
    BasePillButton,
    BaseInput,
    BaseTextarea,
    ShowCard,
  },
  data() {
    this.convertedMonthValue = "";
    return {
      userID: this.$store.state.userID,
      imageUploading: false,
      profileDataLoading: false,
      profileShowsLoading: false,
      profileURL: this.$store.state.userID,
      profileID: "",
      profileName: "",
      profileEmail: "",
      profileLocation: "",
      profileContactDetails: [],
      profileImageURL: "",
      profileGenres: [],
      profileShows: [],
      profilePlayerEmbed: "",
      allGenres: [],
      heroDialogVisible: false,
      genresDialogVisible: false,
      embedDialogVisible: false,
      showsDialogVisible: false,
      cancelShowDialogVisible: false,
      addShowDialogVisible: false,
      editShowDialogVisible: false,
      fullListingVisible: false,
      fullShowDetailsVisible: false,
      selectedShow: [],
      selectedFullShowListing:[],
      selectedShowIndex: "",
      day: "",
      month: "",
      year: "",
      city: "",
      venue: "",
      time: "",
      comments: "",
      qrImage: "",
      printQRPage: false,
    };
  },
  methods: {
    createNewContact() {
      this.$store.commit({
        type: "createNewContact",
        contactID: this.profileID,
        contactName: this.profileName,
        contactProfilePic: this.profileImageURL,
      });
    },
    displaySettingsDialog(evt) {
      if (evt == "Hero Image") {
        this.heroDialogVisible = true;
      }
      if (evt == "Genres") {
        this.genresDialogVisible = true;
      }
      if (evt == "Embed Player") {
        this.embedDialogVisible = true;
      }
      if (evt == "Manage Shows") {
        this.showsDialogVisible = true;
      }
      if (evt == "Add Show") {
        this.addShowDialogVisible = true;
        this.showsDialogVisible = false;
      }
    },
    hideSettingsDialog(evt) {
      if (evt == "Hero Image") {
        this.heroDialogVisible = false;
      }
      if (evt == "Genres") {
        this.genresDialogVisible = false;
      }
      if (evt == "Embed Player") {
        this.profilePlayerEmbed =
          this.profilePlayerEmbed.match(/\bhttps?:\/\/\S+/gi)[0];
        axios
          .get("/embed_url")
          .then((res) => {
            console.log(res);
          });
        this.embedDialogVisible = false;
      }
      if (evt == "Manage Shows") {
        this.showsDialogVisible = false;
      }
      if (evt == "Cancel Show") {
        this.cancelShowDialogVisible = false;
      }
      if (evt == "Add Show") {
        this.addShowDialogVisible = false;
      }
      if (evt == "Edit Show") {
        this.editShowDialogVisible = false;
      }
      if (evt == "Full Show Details") {
        this.fullShowDetailsVisible = false;
      }
    },
    selectGenres(evt) {
      const genre = evt;
      const selectedGenres = this.profileGenres;
      const index = selectedGenres.findIndex(x => x.genre_id === genre.genre_id);
      if (selectedGenres.filter(e => e.genre_id === genre.genre_id).length > 0) {
        if (index > -1) {
          
          axios
            .post("/delete_genre", {
              user_id: this.userID,
              genre_id: genre.genre_id,
            })
            .then((res) => {
              console.log(res);
            });
            selectedGenres.splice(index, 1);
        }
      } else {
        selectedGenres.push(genre);
        axios
          .post("/add_genre", {
            user_id: this.userID,
            genre_id: genre.genre_id,
          })
          .then((res) => {
            console.log(res);
          });
      }
    },
    submitShowForm() {

      axios
        .post("/add_show", {
          city: this.city,
          venue: this.venue,
          time: this.time,
          comments: this.comments,
          day: parseInt(this.day, 10),
          month: parseInt(this.month, 10),
          year: parseInt(this.year, 10),
        })
        .then((res) => {
          console.log(res);

         
          axios.get("/get_shows_for_profile/"+this.$route.params.profileURL).then((res) => {
            this.profileShows = res.data;
          });
        });
      this.day = "";
      this.month = "";
      this.year = "";
      this.city = "";
      this.venue = "";
      this.time = "";
      this.comments = "";
      this.addShowDialogVisible = false;
    },
    toggleShowListings() {
      this.fullListingVisible = !this.fullListingVisible;
    },

    fullShowDetails(show){
      this.selectedFullShowListing = show;
      this.fullShowDetailsVisible = true;
      console.log(show)
    },

    editShow(evt) {
      const show = evt;
      const shows = this.profileShows;
      const index = shows.indexOf(evt);

      this.selectedShow = show;
      this.selectedShowIndex = index;
      this.editShowDialogVisible = true;
      this.showsDialogVisible = false;
    },
    submitEditShowForm() { 
      axios
        .post("/update_show", {
          id: this.selectedShow.id,
          city: this.selectedShow.city,
          venue: this.selectedShow.venue,
          time: this.selectedShow.time,
          comments: this.selectedShow.comments,
          day: parseInt(this.selectedShow.day, 10),
          month: parseInt(this.selectedShow.month, 10),
          year: parseInt(this.selectedShow.year, 10),
        })
        .then((res) => {
          console.log(res);

         
          axios.get("/get_shows_for_profile/"+this.$route.params.profileURL).then((res) => {
            this.profileShows = res.data;
          });
        });
      this.editShowDialogVisible = false;
    },
    cancelShow(evt) {
      const show = evt;
      const shows = this.profileShows;
      const index = shows.indexOf(evt);
      this.selectedShow = show;
      this.selectedShowIndex = index;
      this.cancelShowDialogVisible = true;
      this.showsDialogVisible = false;
      console.log(this.selectedShow)
    },
    confirmCancelShow() {
      
      axios
        .get("/cancel_show/"+this.selectedShow.id, {
          id: this.selectedShow.id
        })
        .then((res) => {
          console.log(res);
        });
        this.cancelShowDialogVisible = false;
        this.selectedShow = "";
        this.selectedShowIndex = "";
    },

    uploadImage(event) {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      formData.append("upload_preset", "vfbrvxkj");
      this.profileImageURL = "";
      this.imageUploading = true;
      axios
        .post(
          "https://api.cloudinary.com/v1_1/dgddraffq/image/upload",
          formData
        )
        .then((res) => {
          let publicID = res.data.public_id;
          this.imageUploading = false;
          this.profileImageURL =
            "https://res.cloudinary.com/dgddraffq/image/upload/f_auto,q_auto:best,c_fill,g_faces/v1648123420/" +
            publicID +
            ".jpg";
          this.$store.commit("setHeroImage", this.profileImageURL);
           axios
            .post("/add_image", {
              url: this.profileImageURL,
            })
            .then((res) => {
              console.log(res);
              console.log(this.profileImageURL)
            });
        });
    },

    deleteHero() {
      this.profileImageURL = "";
      axios
        .get("/delete_image")
        .then((res) => {
          console.log(res);
        });
    },
    deleteEmbed(){
      this.profilePlayerEmbed = "";
      axios
        .post("/unembed_url", {
          url: '',
        })
        .then((res) => {
          console.log(res);
        });
    },
    selectedProfileGenres(genre) {
      for (let i = 0; i < this.profileGenres.length; i++) {
        let selectedGenres = this.profileGenres[i].genre;

        if (selectedGenres == genre.genre) {
          return true;
        }
      }
    },
    convertedDay(evt) {
      let day = evt.day.toString();
      if (!day.startsWith("0") && day.length == 1) {
        day = "0" + day;
      }
      return day;
    },
    convertedYear(evt) {
      let year = evt.year.toString();
      if (!year.startsWith("20") && year.length != 3) {
        year = "20" + year;
      }
      return year;
    },
    convertedMonth(evt) {
      let month = this.convertedMonthValue;
      month = evt.month.toString();
      if (!month.startsWith("0") && month.length == 1) {
        month = "0" + month;
      }

      switch (month) {
        case "01":
          this.convertedMonthValue = "Jan";
          break;
        case "02":
          this.convertedMonthValue = "Feb";
          break;
        case "03":
          this.convertedMonthValue = "Mar";
          break;
        case "04":
          this.convertedMonthValue = "Apr";
          break;
        case "05":
          this.convertedMonthValue = "May";
          break;
        case "06":
          this.convertedMonthValue = "Jun";
          break;
        case "07":
          this.convertedMonthValue = "Jul";
          break;
        case "08":
          this.convertedMonthValue = "Aug";
          break;
        case "09":
          this.convertedMonthValue = "Sep";
          break;
        case "10":
          this.convertedMonthValue = "Oct";
          break;
        case "11":
          this.convertedMonthValue = "Nov";
          break;
        case "12":
          this.convertedMonthValue = "Dec";
      }
      return this.convertedMonthValue;
    },
    printQRImage(){
      document.body.classList.add('print-qr-page');
      this.printQRPage = true;
      setTimeout(() => {
        window.print();
      }, 500);
      
    },
    closePrintQRImage(){
      document.body.classList.remove('print-qr-page');
      this.printQRPage = false;
    }
  },
  computed: {
    profileShowsResults() {
      if (this.fullListingVisible == false) {
        return this.profileShows.slice(0, 3);
      } else {
        return this.profileShows;
      }
    },
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  mounted() {
    const url = this.$route.params.profileURL;
      axios.get("/get_genres_for_profile/"+url).then((res) => {
        this.profileGenres = res.data;
      });
      this.profileShowsLoading = true;
      axios.get("/get_shows_for_profile/"+url).then((res) => {

        this.profileShows = res.data;
        this.profileShowsLoading = false;
      });
      axios.get("http://api.qrserver.com/v1/create-qr-code/?data="+location.href+"&size=200x200").then(() => {
       this.qrImage = "http://api.qrserver.com/v1/create-qr-code/?data="+location.href+"&size=200x200"
      });
    this.profileDataLoading = true;
    axios.get("/profile/" + url).then((res) => {
      this.profileID = res.data.id;
      this.profileName = res.data.name;
      this.profileEmail = res.data.email;
      this.profileImageURL = res.data.image_url;
      this.profilePlayerEmbed = res.data.embed_url;
      this.profileLocation = res.data.location;
      this.profileDataLoading = false;
    });

    axios.get("/get_genres").then((res) => {
      this.allGenres = res.data;
    });
  },
};
</script>

<style lang="scss" scoped>
.hero-section {
  background-color: $dark-green;
  width: calc(100% + $spacing-m);
  margin: $spacing-s rem(-16) 0 rem(-16);

  @media (min-width: $desktop) {
    margin: $spacing-m 0 0 0;
    width: 100%;
    display: grid;
    grid-template-columns: 5fr 7fr;
    border-radius: $border-radius-reg;
    overflow: hidden;
  }

  &__details {
    padding: $spacing-m $spacing-s;

    @media (min-width: $desktop) {
      padding: $spacing-l;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  h1,
  p {
    color: #fff;
  }

  p {
    margin-top: $spacing-xs;
    &:before {
      content: "\f3c5";
      font-family: "Font Awesome 5 Pro";
      margin-right: $spacing-xs;
      font-weight: 300;
    }
  }

  &__image-block {
    
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: rem(200);
    overflow: hidden;

    @media (min-width: $desktop) {
      order: 2;
      height: auto;
      max-height: rem(400);
    }

    &--no-image{
      background-color: $lightgrey;
    }

    .icon-button {
      position: absolute;
      bottom: $spacing-s;
      right: $spacing-s;
    }
  }

  &__image-container {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      vertical-align: bottom;
      object-fit: cover;
      @media (min-width: $desktop) {
       border-top-right-radius: $border-radius-reg;
       border-bottom-right-radius: $border-radius-reg;
     }
    }
  }

  &__genres {
    margin-top: $spacing-s;
    width: 100%;
    position: relative;

    .icon-button {
      position: absolute;
      bottom: 0;
      right: 0;

      @media (min-width: $desktop) {
        right: rem(-32);
      }
    }

    .text-icon-button {
      color: #fff;
    }
  }

  .cta-secondary-reverse {
    text-decoration: none;
    margin-top: $spacing-m;
    @include cta;
    @include cta--secondary-reverse;

    @media (min-width: $desktop) {
      align-self: flex-start;
    }
  }
}

.fallback-mailto {
  color: #fff;
  position: relative;
  padding-left: rem(33);
  margin-top: $spacing-m;
  display: block;

  @media (min-width: $desktop) {
    padding-left: rem(41);
  }

  &:before {
    position: absolute;
    font-family: "Font Awesome 5 Pro";
    font-weight: 300;
    margin-right: $spacing-xs;
    width: rem(25);
    text-align: center;
    content: "\f0e0";
    text-decoration: underline;
    left: 0;
    top: rem(3);

    @media (min-width: $desktop) {
      margin-right: $spacing-s;
      top: rem(2);
    }
  }

  &:before {
    text-decoration: none;
  }
}

.profile-body {
  @media (min-width: $desktop) {
    display: grid;
    grid-template-columns: 8fr 4fr;
    grid-column-gap: $spacing-m;
  }
}

.add-player-embed {
  background-color: $lightgrey;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  position: relative;
  height: rem(200);
  width: calc(100% + $spacing-m);
  margin: 0 rem(-16);
  padding: $spacing-s;

  @media (min-width: $desktop) {
    order: 2;
    margin: $spacing-m 0 0 0;
    padding: $spacing-m;
    width: 100%;
    border-radius: $border-radius-reg;
  }

  span {
    font-size: $copy-mobile-s;
    line-height: 1.5;
    @media (min-width: $desktop) {
      font-size: $copy-desktop-s;
    }
  }
}

.player-embed-block {
  position: relative;
  padding: $spacing-m 0;
  z-index: -1;
  @media (min-width: $desktop) {
    order: 2;
  }

  .icon-button {
    position: absolute;
    top: $spacing-m;
    right: 0;
  }
}

.add-upcoming-shows {
  background-color: $lightgrey;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  position: relative;
  height: rem(200);
  width: calc(100% + $spacing-m);
  margin: 0 rem(-16);
  padding: $spacing-s;
  border-top: rem(1) solid $dark-green;

  @media (min-width: $desktop) {
    border-top: none;
    margin: $spacing-m 0 0 0;
    padding: $spacing-m;
    width: 100%;
    border-radius: $border-radius-reg;
  }
}

.modal-dialog--add-show {
  .input-container:first-of-type {
    margin-top: $spacing-m;
  }
}

.add-show-date-fields {
  margin-top: $spacing-m;

  legend {
    font-weight: bold;
    span {
      font-size: $copy-mobile-s;
      font-weight: normal;
      margin-left: $spacing-s;

      @media (min-width: $desktop) {
        font-size: $copy-desktop-s;
      }
    }
  }

  &__inner {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: $spacing-m;
  }

  .legend-helper {
    @include baseLabelHelper;
  }

  label span {
    display: none;
  }
}

.show-container {
  max-height: rem(280);
  overflow: auto;
  //the below is to fix an issue with the box shadow not showing on the right of the card
  padding-right: rem(3);
  margin-right: rem(-3);
  padding-bottom: rem(3);
  margin-bottom: rem(-3);

  @media (min-width: $desktop) {
    max-height: rem(360);
  }
}

.upcoming-shows {
  position: relative;
  margin-top: $spacing-m;

  .icon-button {
    position: absolute;
    top: 0;
    right: 0;
  }

  .text-icon-button--list {
    margin-top: $spacing-m;
  }
}

dialog .cta--primary {
  margin: 2rem auto 0 auto;
  display: block;
}

.dialog-inner {
  .text-icon-button--list {
    margin-top: $spacing-s;
  }
}

.dialog-cta-container {
  margin-top: $spacing-m;

  .cta:first-of-type {
    margin-right: $spacing-s;
  }

  @media (min-width: $desktop) {
    .cta:last-of-type {
      margin-left: $spacing-s;
    }
  }
}

.full-show-details{
  &__info{
    display: block;
    width:100%;
    margin-top:$spacing-s;
    text-transform: capitalize;

    &:first-of-type{
      margin-top:$spacing-m;
    }
  }

  &__cancelled{
    background-color: $rag-red;
    color:#fff;
    font-weight: bold;
    padding: $spacing-xs $spacing-l;
    width: 100%;
    text-align: center;
    display: block;
    margin-top:$spacing-s;
    border-radius: $border-radius-reg;
  }
}


.show-card__cancelled{
  background-color: $rag-red;
  color:#fff;
  position: absolute;
  font-size: $copy-mobile-xs;
  padding: $spacing-xxs $spacing-l;
  transform: rotate(340deg);
  left: rem(60);
  font-weight: bold;

  @media (min-width: $desktop) {
    padding: $spacing-xxs $spacing-xl;
    left: rem(40);
  }
}

.modal-dialog--cancel-show {
  strong {
    @media (min-width: $desktop) {
      display: block;
      padding: 0 $spacing-m;
    }
  }
  p {
    margin-top: $spacing-s;
  }
}

.hero-image-thumb {
  margin-top: $spacing-s;
  height: rem(200);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: rem(1) dashed $mid-grey;

  @media (min-width: $desktop) {
    height: rem(250);
  }

  img {
    width: 100%;
  }
}

.hero-image-uploading {
  width: 100%;
  height: 100%;
  padding: $spacing-m;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pill-button:before {
  font-family: "Font Awesome 5 Pro";
  font-weight: 300;
  content: "\f067";
  margin-right: $spacing-xs;
}

.pill-button--selected:before {
  content: "\f068";
}




.qr-section{
  text-align: center;
  max-width: rem(500);
  margin: 0 auto;
  padding-top: $spacing-l;


  h3{
    margin-top: $spacing-m;
  }

  p{
    margin-top: $spacing-s;
  }

  .cta{
     margin-top: $spacing-s;
  }
}

.print-qr-page{
  header,
  main,
  .qr-section h3,
  .qr-section p{
    display: none;
  }

  .qr-section .cta{
    display: block;
    margin: $spacing-l   auto 0 auto;
  }

  .qr-section__print-info{
    h1{
      margin-top:$spacing-m;
    }
    p{
      display: block;
      margin-top:$spacing-m;
    }

    img{
      margin-top:$spacing-s;
      max-width: rem(200);
    }
  }
}

@media print{
  .print-qr-page{
    header,
    main,
    .qr-section h3,
    .qr-section p,
    .qr-section .cta{
      display: none;
    }

    .qr-section__print-info p{
      display: block;
      margin-top:$spacing-l;
    }
  }
}
</style>
