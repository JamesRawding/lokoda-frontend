<template>
  <div
    class="page-loading-message"
    v-if="profileDataLoading || profileShowsLoading"
  >
    <div><span class="spinner"></span>Profile loading</div>
  </div>
  <div class="page-outer" v-else>
    <the-header :unreadMessageCounter="messageCount"></the-header>
    <main class="page-container">
      <section class="hero-section">
        <div
          class="hero-section__image-block"
          :class="{ 'hero-section__image-block--no-image': !profileImageURL }"
        >
          <div class="hero-section__image-container" v-if="profileImageURL">
            <img
              :src="
                'https://res.cloudinary.com/dgddraffq/image/upload/w_660,h_400,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                profileImageURL
              "
              width="660"
              height="400"
              :alt="profileName + ' profile image'"
              rel="preload"
            />

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
              <span class="modal-dialog__subheading"
                >(Maximum file size 10Mb)</span
              >
              <div class="hero-image-thumb">
                <div v-if="!profileImageURL && !imageUploading">
                  Add image below
                </div>
                <div v-if="imageUploading" class="hero-image-uploading">
                  <span class="spinner"></span>Image Uploading
                </div>
                <img
                  v-if="profileImageURL"
                  :src="
                    'https://res.cloudinary.com/dgddraffq/image/upload/w_450,h_250,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                    profileImageURL
                  "
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
          <p class="hero-section__details-location">{{ profileLocation }}</p>

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
              <span class="modal-dialog__subheading"
                >(Maximum of 5 genres)</span
              >
              <transition name="error">
                <p class="error-message max-genres" v-if="genresMaxAmount">
                  Maximum amount selected
                </p>
              </transition>
              <base-pill-button
                buttonType="button"
                @click="selectGenres(genre)"
                :class="{
                  'pill-button--selected': selectedProfileGenres(genre),
                }"
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
                :disabled="genresMaxAmount"
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
            :href="
              'mailto:' +
              profileEmail +
              '?subject=New message from Lokoda&body=Hi ' +
              profileName +
              ', I have found your profile on Lokoda.'
            "
            >Get In Touch</a
          >
        </div>
      </section>

      <div class="profile-body">
        <section class="player-embed-block" v-if="profilePlayerURL && $store.state.thirdPartyAcceptedState">
          <iframe
            title="music player"
            :src="profilePlayerURL"
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
        <section class="player-embed-block player-embed-block--no-cookies" v-else-if="profilePlayerURL && !$store.state.thirdPartyAcceptedState">
          <div>
            <strong>Third party cookies need to be enabled to listen to this artists tracks.</strong>
            <base-button @click="enableThirdPartyCookies" mode="cta cta--secondary-reverse">Enable Third-Party Cookies</base-button>
          </div>
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
          <span>e.g. Soundcloud, Bandcamp or Spotify</span>
        </div>
        <transition>
          <base-dialog
            mode="modal-dialog"
            v-if="embedDialogVisible"
            @closeDialog="hideSettingsDialog('Embed Player')"
          >
            <transition name="error">
              <p v-if="playerEmbedError" class="error-message">
                Must be an embed from Soundcloud, Bandcamp or Spotify
              </p>
            </transition>
            <base-input
              inputId="playerEmbed"
              inputType="text"
              v-model="profilePlayerEmbed"
              :isRequired="false"
            >
              <template #label>Embed Music Player</template>
              <template #helpertext
                >Enter embed code From Soundcloud, Bandcamp or Spotify</template
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

        <div>
          <section class="bio" v-if="confirmedBio !== null">
            <h2>Bio</h2>
            <base-icon-button
              v-if="$store.state.loggedIn && userID == profileID"
              @click="displaySettingsDialog('Add Bio')"
              buttonType="button"
              mode="icon-button icon-button--edit icon-button--round"
              ariaLabel="edit bio"
            ></base-icon-button>
            <p>{{ confirmedBio }}</p>
          </section>
          <div
            class="add-bio"
            v-else-if="$store.state.loggedIn && userID == profileID"
          >
            <base-text-icon-button
              @click="displaySettingsDialog('Add Bio')"
              buttonType="button"
              mode="text-icon-button text-icon-button--plus"
              >Add bio</base-text-icon-button
            >
          </div>
          <transition>
            <base-dialog
              mode="modal-dialog modal-dialog--add-bio"
              v-if="bioDialogVisible"
              @closeDialog="hideSettingsDialog('Add Bio')"
            >
              <strong>Enter Bio Details</strong>
              <transition name="error">
                <p
                  class="error-message max-characters"
                  v-if="bioCharactersRemaining < 0"
                >
                  Maximum characters reached
                </p>
              </transition>
              <form @submit.prevent="submitBioForm">
                <base-textarea
                  inputId="profileBio"
                  v-model="profileBio"
                  :isRequired="false"
                >
                  <template #label>Bio</template>
                  <template #helpertext
                    >Max of 350 characters.<span>
                      ({{ bioCharactersRemaining }} remaining)</span
                    ></template
                  >
                </base-textarea>
                <base-button
                  buttonType="submit"
                  mode="cta cta--primary"
                  :disabled="bioCharactersRemaining < 0"
                  >Save Bio</base-button
                >
              </form>
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
              role="button"
              tabindex="0"
              @click="fullShowDetails(show)"
              @keypress.enter="fullShowDetails(show)"
              @editThisShow="editShow(show)"
              @deleteThisShow="cancelShow(show)"
              v-for="show in profileShowsResults"
              :key="show.venue + show.id"
            >
              <template #month>{{ convertedMonth(show) }}</template>
              <template #day>{{ convertedDay(show) }}</template>
              <template #year>{{ convertedYear(show) }}</template>
              <template #city>{{ show.city }}</template>
              <template #venue>{{ show.venue }}</template>
              <template #time>{{ show.time }}</template>
              <template v-if="show.status == 'CANCELLED'" #status
                ><span class="show-card__cancelled"
                  >Show Cancelled</span
                ></template
              >
            </show-card>

            <transition>
              <base-dialog
                mode="modal-dialog"
                v-if="fullShowDetailsVisible"
                @closeDialog="hideSettingsDialog('Full Show Details')"
              >
                <section class="full-show-details">
                  <h2>Full Show Details</h2>
                  <span
                    class="full-show-details__cancelled"
                    v-if="selectedFullShowListing.status === 'CANCELLED'"
                    >Show Cancelled</span
                  >
                  <span class="full-show-details__info"
                    ><strong>City: </strong
                    ><span>{{ selectedFullShowListing.city }}</span></span
                  >
                  <span class="full-show-details__info"
                    ><strong>Venue: </strong
                    ><span>{{ selectedFullShowListing.venue }}</span></span
                  >
                  <span class="full-show-details__info"
                    ><strong>Date: </strong
                    ><span
                      >{{ convertedDay(selectedFullShowListing) }}
                      {{ convertedMonth(selectedFullShowListing) }}
                      {{ convertedYear(selectedFullShowListing) }}</span
                    ></span
                  >
                  <span class="full-show-details__info"
                    ><strong>Time: </strong
                    ><span>{{ selectedFullShowListing.time }}</span></span
                  >
                  <span class="full-show-details__info"
                    ><strong>Comments: </strong>
                    <p>{{ selectedFullShowListing.comments }}</p></span
                  >
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
                  :key="show.venue + show.id + 'edit'"
                >
                  <template #month>{{ convertedMonth(show) }}</template>
                  <template #day>{{ convertedDay(show) }}</template>
                  <template #year>{{ convertedYear(show) }}</template>
                  <template #city>{{ show.city }}</template>
                  <template #venue>{{ show.venue }}</template>
                  <template #time>{{ show.time }}</template>
                  <template v-if="show.status == 'CANCELLED'" #status
                    ><span class="show-card__cancelled"
                      >Show Cancelled</span
                    ></template
                  >
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
                  :isRequired="false"
                >
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
                  :isRequired="false"
                >
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
                  >{{ convertedDay(selectedShow) }}
                  {{ convertedMonth(selectedShow) }}
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
      </div>

      <section class="social-block" v-if="profileSocialLinks.length > 0">
        <base-icon-button
          v-if="$store.state.loggedIn && userID == profileID"
          @click="displaySettingsDialog('Add Social')"
          buttonType="button"
          mode="icon-button icon-button--edit icon-button--round"
          ariaLabel="edit social links"
        ></base-icon-button>
        <div class="social-block__inner">
          <h2 class="h3">Follow {{ profileName }} on:</h2>

          <div class="social-block__icon-container">
            <!-- <base-icon-link
              v-for="link in profileSocialLinks"
              :key="link.name"
              mode="icon-link icon-link--round"
              :to="link.url"
            >
              <span class="sr-text">{{ link.name }} account</span>
              <span
                aria-hidden="true"
                class="fab"
                :class="'fa-' + link.name"
              ></span>
            </base-icon-link> -->
            <a 
              v-for="link in profileSocialLinks"
              :key="link.name"
              class="icon-link icon-link--round"
              :href="link.url"
              >
              <span class="sr-text">{{ link.name }} account</span>
              <span
                aria-hidden="true"
                class="fab"
                :class="'fa-' + link.name"
              ></span>

            </a>
          </div>
        </div>
      </section>
      <div
        class="add-social"
        v-else-if="$store.state.loggedIn && userID == profileID"
      >
        <base-text-icon-button
          @click="displaySettingsDialog('Add Social')"
          buttonType="button"
          mode="text-icon-button text-icon-button--plus"
          >Add Social Links</base-text-icon-button
        >
      </div>

      <transition>
        <base-dialog
          mode="modal-dialog modal-dialog--add-social-links"
          v-if="socialDialogVisible"
          @closeDialog="hideSettingsDialog('Add Social')"
        >
          <strong>Enter Social Links</strong>
          <!-- <transition name="error">
                <p class="error-message max-characters" v-if="bioCharactersRemaining < 0">
                  Maximum characters reached
                </p>
              </transition> -->
          <form @submit.prevent="submitSocialForm">
            <base-input
              inputId="appleMusicLink"
              inputType="url"
              v-model="appleMusicLink"
            >
              <template #label>Apple Music</template>
            </base-input>
            <base-input
              inputId="bandcampLink"
              inputType="url"
              v-model="bandcampLink"
            >
              <template #label>Bandcamp</template>
            </base-input>
            <base-input
              inputId="soundcloudLink"
              inputType="url"
              v-model="soundcloudLink"
            >
              <template #label>Soundcloud</template>
            </base-input>
            <base-input
              inputId="deezerLink"
              inputType="url"
              v-model="deezerLink"
            >
              <template #label>Deezer</template>
            </base-input>
            <base-input
              inputId="spotifyLink"
              inputType="url"
              v-model="spotifyLink"
            >
              <template #label>Spotify</template>
            </base-input>
            <base-input
              inputId="youtubeLink"
              inputType="url"
              v-model="youtubeLink"
            >
              <template #label>Youtube</template>
            </base-input>
            <base-input
              inputId="tiktokLink"
              inputType="url"
              v-model="tiktokLink"
            >
              <template #label>TikTok</template>
            </base-input>
            <base-input
              inputId="instagramLink"
              inputType="url"
              v-model="instagramLink"
            >
              <template #label>Instagram</template>
            </base-input>
            <base-input
              inputId="twitterLink"
              inputType="url"
              v-model="twitterLink"
            >
              <template #label>Twitter</template>
            </base-input>
            <base-input
              inputId="facebookLink"
              inputType="url"
              v-model="facebookLink"
            >
              <template #label>Facebook</template>
            </base-input>
            <base-input
              inputId="snapchatLink"
              inputType="url"
              v-model="snapchatLink"
            >
              <template #label>Snapchat</template>
            </base-input>
            <base-button buttonType="submit" mode="cta cta--primary"
              >Save Social Links</base-button
            >
          </form>
        </base-dialog>
      </transition>

      <section
        class="qr-section"
        v-if="$store.state.loggedIn && userID == profileID"
      >
        <img :src="qrImage" :alt="profileName + 'qr code'" />
        <h3>Need to share your profile?</h3>
        <p>
          This QR code can be printed so you can display at your next show,
          making it easier for your fans to find you.
        </p>
        <div v-if="printQRPage" class="qr-section__print-info">
          <h1>{{ profileName }}</h1>
          <p>Discover on</p>
          <img
            src="https://res.cloudinary.com/dgddraffq/image/upload/v1645182101/lokoda-logo_izjrxu.svg"
            alt="lokoda logo"
          />
        </div>
        <base-button
          v-if="!printQRPage"
          @click="printQRImage"
          buttonType="button"
          mode="cta cta--secondary-reverse"
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

      <p v-if="$store.state.loggedIn && userID == profileID" class="disclaimer">
        Lokoda reserve the right to delete your account if you upload any
        material that is deemed to be obscene or offensive.
      </p>

      <span
        class="toast-notification"
        :class="{ 'toast-notification--active': showAddedToast }"
        >Show added</span
      >
      <span
        class="toast-notification"
        :class="{ 'toast-notification--active': showUpdatedToast }"
        >Show updated</span
      >
      <span
        class="toast-notification"
        :class="{ 'toast-notification--active': showCancelledToast }"
        >Show cancelled</span
      >
    </main>

    <the-footer></the-footer>
  </div>
</template>

<script>
import axios from "axios";
import vClickOutside from "click-outside-vue3";
import TheHeader from "../components/layouts/TheHeader.vue";
import TheFooter from "../components/layouts/TheFooter.vue";
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
    TheFooter,
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
      profilePlayerURL: "",
      profileBio: "",
      confirmedBio: "",
      allGenres: [],
      heroDialogVisible: false,
      genresDialogVisible: false,
      embedDialogVisible: false,
      showsDialogVisible: false,
      cancelShowDialogVisible: false,
      addShowDialogVisible: false,
      bioDialogVisible: false,
      editShowDialogVisible: false,
      socialDialogVisible: false,
      fullListingVisible: false,
      fullShowDetailsVisible: false,
      selectedShow: [],
      selectedFullShowListing: [],
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
      showAddedToast: false,
      showUpdatedToast: false,
      showCancelledToast: false,
      genresMaxAmount: false,
      playerEmbedError: false,

      profileSocialLinks: [
        // {
        //   id:"1",
        //   name: "apple",
        //   url: "https://google.com"
        // },
        // {
        //   id:"2",
        //   name: "bandcamp",
        //   url: "https://bandcamp.com"
        // },
        // {
        //   id:"3",
        //   name: "spotify",
        //   url: "https://bandcamp.com"
        // },
        // {
        //   id:"4",
        //   name: "deezer",
        //   url: "https://bandcamp.com"
        // },
        // {
        //   id:"5",
        //   name: "youtube",
        //   url: "https://bandcamp.com"
        // },
        // {
        //   id:"6",
        //   name: "soundcloud",
        //   url: "https://bandcamp.com"
        // },
        // {
        //   id:"7",
        //   name: "tiktok",
        //   url: "https://bandcamp.com"
        // },
        // {
        //   id:"8",
        //   name: "instagram",
        //   url: "https://bandcamp.com"
        // },
        // {
        //   id:"9",
        //   name: "twitter",
        //   url: "https://bandcamp.com"
        // },
        // {
        //   id:"10",
        //   name: "facebook-f",
        //   url: "https://bandcamp.com"
        // },
      ],
      appleMusicLink: "",
      bandcampLink: "",
      spotifyLink: "",
      deezerLink: "",
      youtubeLink: "",
      soundcloudLink: "",
      tiktokLink: "",
      instagramLink: "",
      twitterLink: "",
      facebookLink: "",
      snapchatLink: "",
      messageCount: 0,
    };
  },
  methods: {
    createNewContact() {
      axios.get("/api/get_contacts").then((res) => {
        // console.log('fetch contacts')
        // console.log(this.profileID)
        if (res.data.some((e) => e.id === this.profileID)) {
          //console.log("contact alreasdy exists");
          this.$store.commit({
            type: "createNewContact",
            contactID: this.profileID,
            contactName: this.profileName,
          });
        } else {
          //console.log("contact doesnt exist");
          this.$store.commit({
            type: "createNewContact",
            contactID: this.profileID,
            contactName: this.profileName,
          });
          axios.get("/api/add_contact/" + this.profileID).then(() => {
            // console.log('add contact')
            // console.log(res.data);
            axios.get("api/get_contacts").then((res) => {
              //console.log('get contacts after contact added')
              this.contacts = res.data;
              this.messagesLoading = false;
              // console.log(res.data)
              // console.log(this.contacts)
            });
          });
        }
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
      if (evt == "Add Bio") {
        this.bioDialogVisible = true;
      }
      if (evt == "Add Show") {
        this.addShowDialogVisible = true;
        this.showsDialogVisible = false;
      }
      if (evt == "Add Social") {
        this.socialDialogVisible = true;
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
        if (this.profilePlayerEmbed == "") {
          this.playerEmbedError = false;
          this.embedDialogVisible = false;
        } else if (
          this.profilePlayerEmbed.includes("soundcloud") ||
          this.profilePlayerEmbed.includes("bandcamp") ||
          this.profilePlayerEmbed.includes("spotify")
        ) {
          this.profilePlayerEmbed =
            this.profilePlayerEmbed.match(/\bhttps?:\/\/\S+/gi)[0];
          axios
            .post("/api/embed_url", {
              url: this.profilePlayerEmbed,
            })
            .then(() => {
              this.profilePlayerURL = this.profilePlayerEmbed;
            });
          this.playerEmbedError = false;
          this.embedDialogVisible = false;
        } else {
          this.playerEmbedError = true;
        }
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
      if (evt == "Add Bio") {
        this.bioDialogVisible = false;
      }
      if (evt == "Add Social") {
        this.socialDialogVisible = false;
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
      const index = selectedGenres.findIndex(
        (x) => x.genre_id === genre.genre_id
      );
      if (
        selectedGenres.filter((e) => e.genre_id === genre.genre_id).length > 0
      ) {
        if (index > -1) {
          axios.post("/api/delete_genre", {
            user_id: this.userID,
            genre_id: genre.genre_id,
          });
          // .then((res) => {
          //   console.log(res);
          // });
          selectedGenres.splice(index, 1);
          if (this.profileGenres.length <= 5) {
            this.genresMaxAmount = false;
          }
        }
      } else {
        if (this.profileGenres.length <= 4) {
          selectedGenres.push(genre);
          axios.post("/api/add_genre", {
            user_id: this.userID,
            genre_id: genre.genre_id,
          });
        } else {
          this.genresMaxAmount = true;
          setTimeout(() => {
            this.genresMaxAmount = false;
          }, 5000);
        }

        // .then((res) => {
        //   console.log(res);
        // });
      }
    },
    submitShowForm() {
      axios
        .post("/api/add_show", {
          city: this.city,
          venue: this.venue,
          time: this.time,
          comments: this.comments,
          day: parseInt(this.day, 10),
          month: parseInt(this.month, 10),
          year: parseInt(this.year, 10),
        })
        .then((res) => {
          // console.log(res);
          axios
            .get("/api/get_shows_for_profile/" + this.$route.params.profileURL)
            .then((res) => {
              this.profileShows = res.data;
            });
          if (res.data == "Show added") {
            this.showAddedToast = true;
            setTimeout(() => {
              this.showAddedToast = false;
            }, 3000);
          }
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

    fullShowDetails(show) {
      this.selectedFullShowListing = show;
      this.fullShowDetailsVisible = true;
      //console.log(show)
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
        .post("/api/update_show", {
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
          //console.log(res);
          axios
            .get("/api/get_shows_for_profile/" + this.$route.params.profileURL)
            .then((res) => {
              this.profileShows = res.data;
            });
          if (res.data == "Show updated") {
            this.showUpdatedToast = true;
            setTimeout(() => {
              this.showUpdatedToast = false;
            }, 3000);
          }
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
      //console.log(this.selectedShow)
    },
    confirmCancelShow() {
      axios
        .get("/api/cancel_show/" + this.selectedShow.id, {
          id: this.selectedShow.id,
        })
        .then((res) => {
          //console.log(res);
          axios
            .get("/api/get_shows_for_profile/" + this.$route.params.profileURL)
            .then((res) => {
              this.profileShows = res.data;
            });
          if (res.data == "Show cancelled") {
            this.showCancelledToast = true;
            setTimeout(() => {
              this.showCancelledToast = false;
            }, 3000);
          }
        });
      this.cancelShowDialogVisible = false;
      this.selectedShow = "";
      this.selectedShowIndex = "";
    },

    submitBioForm() {

      if (this.bioCharactersRemaining >= 0) {
        this.bioDialogVisible = false;
        this.confirmedBio = this.profileBio;

        axios
          .post("/api/add_bio",{
            "bio": this.confirmedBio
          })
          .then((res) => {
            console.log(res)
          });
      }
    },

    submitSocialForm() {
      this.profileSocialLinks = [];
      if (this.appleMusicLink !== "") {
        const apple = {
          id: "1",
          name: "apple",
          url: this.appleMusicLink,
        };
        this.profileSocialLinks.push(apple);
        axios.post("/api/social", {
          name: 'apple',
          url: this.appleMusicLink,
        }).then((res) => {
          console.log(res)
        });
      }
      if (this.bandcampLink !== "") {
        const bandcamp = {
          id: "2",
          name: "bandcamp",
          url: this.bandcampLink,
        };
        this.profileSocialLinks.push(bandcamp);
        axios.post("/api/social", {
          name: 'bandcamp',
          url: this.bandcampLink,
        }).then((res) => {
          console.log(res)
        });
      }
      if (this.spotifyLink !== "") {
        const spotify = {
          id: "3",
          name: "spotify",
          url: this.spotifyLink,
        };
        this.profileSocialLinks.push(spotify);
        axios.post("/api/social", {
          name: 'spotify',
          url: this.spotifyLink,
        }).then((res) => {
          console.log(res)
        });
      }
      if (this.deezerLink !== "") {
        const deezer = {
          id: "4",
          name: "deezer",
          url: this.deezerLink,
        };
        this.profileSocialLinks.push(deezer);
        axios.post("/api/social", {
          name: 'deezer',
          url: this.deezerLink,
        }).then((res) => {
          console.log(res)
        });
      }
      if (this.soundcloudLink !== "") {
        const soundcloud = {
          id: "5",
          name: "soundcloud",
          url: this.soundcloudLink,
        };
        this.profileSocialLinks.push(soundcloud);
        axios.post("/api/social", {
          name: 'soundcloud',
          url: this.soundcloudLink,
        }).then((res) => {
          console.log(res)
        });
      }

      if (this.youtubeLink !== "") {
        const youtube = {
          id: "6",
          name: "youtube",
          url: this.youtubeLink,
        };
        this.profileSocialLinks.push(youtube);
        axios.post("/api/social", {
          name: 'youtube',
          url: this.youtubeLink,
        }).then((res) => {
          console.log(res)
        });
      }
      if (this.tiktokLink !== "") {
        const tiktok = {
          id: "7",
          name: "tiktok",
          url: this.tiktokLink,
        };
        this.profileSocialLinks.push(tiktok);
        axios.post("/api/social", {
          name: 'tiktok',
          url: this.tiktokLink,
        }).then((res) => {
          console.log(res)
        });
      }
      if (this.instagramLink !== "") {
        const instagram = {
          id: "8",
          name: "instagram",
          url: this.instagramLink,
        };
        this.profileSocialLinks.push(instagram);
        axios.post("/api/social", {
          name: 'instagram',
          url: this.instagramLink,
        }).then((res) => {
          console.log(res)
        });
      }
      if (this.twitterLink !== "") {
        const twitter = {
          id: "9",
          name: "twitter",
          url: this.twitterLink,
        };
        this.profileSocialLinks.push(twitter);
        axios.post("/api/social", {
          name: 'twitter',
          url: this.twitterLink,
        }).then((res) => {
          console.log(res)
        });
      }
      if (this.facebookLink !== "") {
        const facebook = {
          id: "10",
          name: "facebook-f",
          url: this.facebookLink,
        };
        this.profileSocialLinks.push(facebook);
        axios.post("/api/social", {
          name: 'facebook',
          url: this.facebookLink,
        }).then((res) => {
          console.log(res)
        });
      }

      if (this.snapchatLink !== "") {
        const snapchat = {
          id: "10",
          name: "snapchat",
          url: this.snapchatLink,
        };
        this.profileSocialLinks.push(snapchat);
        axios.post("/api/social", {
          name: 'snapchat',
          url: this.snapchatLink,
        }).then((res) => {
          console.log(res)
        });
      }

      this.socialDialogVisible = false;
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
          // this.profileImageURL =
          //   "https://res.cloudinary.com/dgddraffq/image/upload/f_auto,q_auto:best,c_fill,g_faces/v1648123420/" +
          //   publicID +
          //   ".jpg";
          this.profileImageURL = "v1648123420/" + publicID + ".jpg";
          this.$store.commit("setHeroImage", this.profileImageURL);
          axios.post("/api/add_image", {
            url: this.profileImageURL,
          });
          // .then((res) => {
          //   console.log(res);
          //   //console.log(this.profileImageURL)
          // });
        });
    },

    deleteHero() {
      this.profileImageURL = "";
      axios.get("/api/delete_image");
      // .then((res) => {
      //   console.log(res);
      // });
    },
    deleteEmbed() {
      this.profilePlayerEmbed = "";
      axios.post("/api/unembed_url", {
        url: "",
      });
      // .then((res) => {
      //   console.log(res);
      // });
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
    printQRImage() {
      document.body.classList.add("print-qr-page");
      this.printQRPage = true;
      setTimeout(() => {
        window.print();
      }, 500);
    },
    closePrintQRImage() {
      document.body.classList.remove("print-qr-page");
      this.printQRPage = false;
    },
    enableThirdPartyCookies(){
      function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays += 3600000*24*30));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }
      setCookie('cookiesAccepted',true, 2 );
      setCookie('thirdPartyAccepted',true, 2 );
      this.$store.commit("thirdPartyAcceptedState",true);
      this.$store.commit("cookiesAcceptedState",true);
      window.location.reload()
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
    bioCharactersRemaining() {
      let charCount = this.profileBio.length,
        limit = 350;
      return limit - charCount;
    },
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  mounted() {
    const url = this.$route.params.profileURL;
    this.profileDataLoading = true;
    axios.get("/api/profile/" + url).then((res) => {
      this.profileImageURL = res.data.image_url;
      this.profileID = res.data.id;
      this.profileName = res.data.name;
      this.profileEmail = res.data.email;
      this.profilePlayerURL = res.data.embed_url;
      this.profileLocation = res.data.location;
      this.profileBio = res.data.bio;
      this.confirmedBio = res.data.bio;
      this.profileDataLoading = false;
      

      if (
        this.$store.state.loggedIn &&
        this.profileID == this.$store.state.userID
      ) {
        this.$store.commit("setNewProfileLocation", res.data.location);
      }
    });
    axios.get("/api/get_genres_for_profile/" + url).then((res) => {
      this.profileGenres = res.data;
    });
    this.profileShowsLoading = true;
    axios.get("/api/get_shows_for_profile/" + url).then((res) => {
      this.profileShows = res.data;
      this.profileShowsLoading = false;
    });
    axios
      .get(
        "https://api.qrserver.com/v1/create-qr-code/?data=" +
          location.href +
          "&size=200x200"
      )
      .then(() => {
        this.qrImage =
          "https://api.qrserver.com/v1/create-qr-code/?data=" +
          location.href +
          "&size=200x200";
      });

    axios.get("/api/get_genres").then((res) => {
      this.allGenres = res.data;
    });


   axios.get("/api/social/" + url).then((res) => {
      this.profileSocialLinks = res.data;

        

      const returnAppleObject = res.data.find(element => element.name === 'apple');
      const returnBandcampObject = res.data.find(element => element.name === 'bandcamp');
      const returnSpotifypObject = res.data.find(element => element.name === 'spotify');
      const returnDeezerObject = res.data.find(element => element.name === 'deezer');
      const returnYoutubeObject = res.data.find(element => element.name === 'youtube');
      const returnSoundcloudObject = res.data.find(element => element.name === 'soundcloud');
      const returnTiktokObject = res.data.find(element => element.name === 'tiktok');
      const returnInstagramObject = res.data.find(element => element.name === 'instagram');
      const returnTwitterObject = res.data.find(element => element.name === 'twitter');
      const returnFacebookObject = res.data.find(element => element.name === 'facebook');
      const returnSnapchatObject = res.data.find(element => element.name === 'snapchat');
      
      
      if(returnAppleObject != undefined){
        this.appleMusicLink = returnAppleObject.url;
      }
      if(returnBandcampObject != undefined){
        this.bandcampLink = returnBandcampObject.url;
      }
      if(returnSpotifypObject != undefined){
        this.spotifyLink = returnSpotifypObject.url;
      }
      if(returnDeezerObject != undefined){
        this.deezerLink = returnDeezerObject.url;
      }
      if(returnYoutubeObject != undefined){
        this.youtubeLink = returnYoutubeObject.url;
      }
      if(returnSoundcloudObject != undefined){
        this.soundcloudLink = returnSoundcloudObject.url;
      }
      if(returnTiktokObject != undefined){
        this.tiktokLink = returnTiktokObject.url;
      }
      if(returnInstagramObject != undefined){
        this.instagramLink = returnInstagramObject.url;
      }
      if(returnTwitterObject != undefined){
        this.twitterLink = returnTwitterObject.url;
      }
      if(returnFacebookObject != undefined){
        this.facebookLink = returnFacebookObject.url;
      }
      if(returnSnapchatObject != undefined){
        this.snapchatLink = returnSnapchatObject.url;
      }
    });

    if(this.$store.state.loggedIn){
    axios.get("/api/unread_messages").then((res) => {
      this.messageCount = res.data
      })

    setInterval(() => {
      axios.get("/api/unread_messages").then((res) => {
        this.messageCount = res.data;
      })
    }, 60000);
    }
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  padding-top: 0;

  @media (min-width: $desktop) {
    padding-top: $spacing-m;
  }
}
.hero-section {
  background-color: $dark-green;
  width: calc(100% + $spacing-m);
  margin: 0 rem(-16) 0 rem(-16);

  @media (min-width: $desktop) {
    margin: 0;
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

    &-location {
      margin-top: $spacing-xs;
      &:before {
        content: "\f3c5";
        font-family: "Font Awesome 5 Pro";
        margin-right: $spacing-xs;
        font-weight: 300;
      }
    }
  }

  h1,
  p {
    color: #fff;
    text-transform: capitalize;
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
      //max-height: rem(400);
    }

    &--no-image {
      background-color: $lightgrey;
    }

    .icon-button {
      position: absolute;
      bottom: $spacing-s;
      right: $spacing-s;
    }

    > .text-icon-button{
      @media(min-width:$desktop){
        padding: 0 $spacing-s;
        border-radius: $border-radius-reg;
        &:hover{
          background-color: $lightergrey;
        }
      }
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

  .max-genres {
    margin-top: $spacing-s;
    margin-bottom: $spacing-s;
  }

  .cta-secondary-reverse {
    text-decoration: none;
    margin-top: $spacing-m;
    @include cta;
    @include cta--secondary-reverse;
    display: inline-block;

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

  .text-icon-button{
    @media(min-width:$desktop){
      padding: 0 $spacing-s;
      border-radius: $border-radius-reg;
      &:hover{
        background-color: $lightergrey;
      }
    }
  }
}

.player-embed-block {
  position: relative;
  padding: $spacing-m 0;
  //z-index: -1;
  @media (min-width: $desktop) {
    order: 2;
    padding-bottom: 0;
  }

  .icon-button {
    position: absolute;
    top: $spacing-m;
    right: 0;
  }

  &--no-cookies{
    div{
      background-color: $mid-grey;
      color:#fff;
      border-radius:$border-radius-reg;
      padding:$spacing-m;
      text-align: center;
    }

    .cta{
      margin-top:$spacing-m;
    }
  }
}

.add-upcoming-shows,
.add-bio,
.add-social {
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

  .text-icon-button{
    @media(min-width:$desktop){
      padding: 0 $spacing-s;
      border-radius: $border-radius-reg;
      &:hover{
        background-color: $lightergrey;
      }
    }
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

.upcoming-shows,
.bio {
  position: relative;
  margin-top: $spacing-m;
}

.modal-dialog--add-bio + .upcoming-shows {
  margin-top: $spacing-m;
}

.bio + .upcoming-shows {
  margin-top: $spacing-l;
}

.upcoming-shows {
  .icon-button {
    position: absolute;
    top: 0;
    right: 0;
  }

  .text-icon-button--list {
    margin-top: $spacing-m;
  }
}

.bio {
  padding: $spacing-s;
  box-shadow: $box-shadow;

  @media (min-width: $desktop) {
    padding: $spacing-m;
  }

  .icon-button {
    position: absolute;
    top: $spacing-s;
    right: $spacing-s;
  }

  p {
    margin-top: $spacing-s;
  }
}

.max-characters {
  margin-top: $spacing-s;
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

.full-show-details {
  &__info {
    display: block;
    width: 100%;
    margin-top: $spacing-s;
    text-transform: capitalize;

    &:first-of-type {
      margin-top: $spacing-m;
    }

    span{
      display: block;
      line-height: 1.5;
    }
  }

  &__cancelled {
    background-color: $rag-red;
    color: #fff;
    font-weight: bold;
    padding: $spacing-xs $spacing-l;
    width: 100%;
    text-align: center;
    display: block;
    margin-top: $spacing-s;
    border-radius: $border-radius-reg;
  }
}

.show-card__cancelled {
  background-color: $rag-red;
  color: #fff;
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

.social-block {
  background-color: $mid-grey;
  text-align: center;
  margin-top: $spacing-l;
  position: relative;
  border-radius: $border-radius-reg;

  &__inner {
    max-width: rem(1200);
    margin: 0 auto;
    width: 100%;
    padding: $spacing-l $spacing-s rem(48) $spacing-s;

    @media (min-width: $desktop) {
      padding: $spacing-l $spacing-m rem(48) $spacing-m;
    }
  }

  &__icon-container {
    margin-top: $spacing-m;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .icon-link{
      width:rem(44);
      height: rem(44);
      border: none;
      background-color:#fff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $copy;
      position: relative;
      text-indent: -100000px;
      text-decoration: none;
      margin: $spacing-s;


      &--round{
        border-radius:100%;
        box-shadow: $box-shadow;

        @media(min-width:$desktop){
          &:after{
            content:'';
            border-radius: 100%;
            border: rem(2) solid transparent;
            position: absolute;
            left: rem(-4);
            right: rem(-4);
            top: rem(-4);
            bottom: rem(-4);
            transition: .25s all ease-in-out;
          }

          &:hover:after{
            border-color: $dark-green;
          }
        }
      }
    }
  }

  .icon-button {
    top: $spacing-s;
    right: $spacing-s;
    position: absolute;

    @media (min-width: $desktop) {
      top: $spacing-m;
      right: $spacing-m;
    }
  }

  h2 {
    color: #fff;
    text-transform: capitalize;
  }

  .icon-link .fab {
    text-indent: 0;
  }
}

.qr-section {
  text-align: center;
  max-width: rem(500);
  margin: $spacing-l auto 0 auto;
  padding: $spacing-m;
  border-radius: $border-radius-reg;
  color: #fff;
  background-color: $mid-grey;

  @media (min-width: $desktop) {
    margin: $spacing-xl auto 0 auto;
  }

  img {
    max-width: rem(150);
  }

  h3 {
    margin-top: $spacing-m;
  }

  p {
    margin-top: $spacing-s;
  }

  .cta {
    margin-top: $spacing-m;
  }
}

.print-qr-page {
  header,
  footer,
  section,
  .profile-body,
  .qr-section h3,
  .qr-section p,
  .disclaimer {
    display: none;
  }

  .qr-section {
    display: block;
    color: $copy;
    background-color: #fff;
  }

  .qr-section .cta {
    display: block;
    margin: $spacing-l auto 0 auto;
  }

  .qr-section__print-info {
    h1 {
      margin-top: $spacing-m;
      text-transform: capitalize;
    }
    p {
      display: block;
      margin-top: $spacing-m;
    }

    img {
      margin-top: $spacing-s;
      max-width: rem(200);
    }
  }
}

.disclaimer {
  text-align: center;
  margin: $spacing-l auto 0 auto;
  max-width: rem(800);
}

@media print {
  .print-qr-page {
    header,
    footer,
    section,
    .profile-body,
    .qr-section h3,
    .qr-section p,
    .qr-section .cta,
    .disclaimer {
      display: none;
    }

    .qr-section {
      display: block;
    }

    .qr-section__print-info p {
      display: block;
      margin-top: $spacing-l;
    }
  }
}
</style>
