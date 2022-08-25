<template>
  <div class="page-outer messages-page">
    <the-header></the-header>
    <main ref="messagesPageBody" class="page-container">
      <div class="page-grid">
        <section v-if="messagesListVisible">
          <div class="messages-header">
            <a
              v-if="!messagesToDelete"
              class="messages-header__back-link"
              href="javascript:history.go(-1)"
              ><span class="sr-only"> Go Back</span></a
            >
            <h1 class="h3" v-if="messagesToDelete">Delete Chats</h1>
            <h1 class="h3" v-else>Chats</h1>
            <div class="messages-header__button-container">
              <base-text-icon-button
                v-if="!messagesToDelete"
                @click="showContacts"
                mode="text-icon-button text-icon-button--new-message"
                aria-label="new message"
                ><span class="sr-text">New</span></base-text-icon-button
              >
              <base-text-icon-button
                v-else
                @click="showMessageList"
                mode="text-icon-button text-icon-button--back"
                ><span class="sr-text">Chats</span></base-text-icon-button
              >
              <base-text-icon-button
                @click="showMessagesOptions"
                mode="text-icon-button text-icon-button--ellipsis"
                aria-label="manage messages"
                ><span class="sr-text">Manage</span></base-text-icon-button
              >

              
              <transition>
                <base-dialog
                  @closeDialog="hideMessagesOptions"
                  v-if="isMessagesOptionsDisplayed"
                >
                  <strong>Chat Options</strong>
                  <base-text-icon-button
                    @click="selectMessagesToDelete"
                    mode="text-icon-button text-icon-button--trash"
                    >Delete Chat</base-text-icon-button
                  >
                </base-dialog>
              </transition>
            </div>
          </div>
          <!-- <search-bar @searched="searchMessages" v-if="messages.length > 0" searchId="searchMessages" ariaLabel="search messages" searchPlaceholder="Search Messages"></search-bar> -->
          <div>
            <div v-if="messagesLoading" class="messages-loading">
              <span class="spinner"></span>Chats loading
            </div>

            <ul v-else-if="!messagesToDelete && messages" class="messages-list">
              <li
                @click="selectedMessage(messageThread.id)"
                @keypress.enter="selectedMessage(messageThread.id)"
                class="messages-list__item"
                :class="{
                  'messages-list__item--active': messageThread.messageActive,
                }"
                v-for="messageThread in messages"
                :key="messageThread.id"
                tabindex="0"
                role="button"
              >
                <div
                  v-if="
                    messageThread.users.length == 2 &&
                    messageThreadImage(messageThread) == true
                  "
                  class="messages-list__item-img"
                >
                  <img
                    :src="
                      'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                      usersInGroup(messageThread)
                    "
                    alt=""
                  />
                </div>
                <div
                  v-if="
                    messageThread.users.length == 2 &&
                    messageThreadImage(messageThread) == false
                  "
                  class="messages-list__item-img messages-list__item-img messages-list__item-img--fallback"
                >
                  {{ usersInGroup(messageThread) }}
                </div>
                <div
                  v-else-if="messageThread.users.length !== 2"
                  class="messages-list__item-img messages-list__item-img--group"
                ></div>

                <div class="messages-list__item-details">
                  <!-- <h2 class="messages-list__item-name"><span v-for="recipientName in messageThread.messageRecipientNames" :key="recipientName + messageID">{{recipientName}}</span></h2> -->
                  <h2 class="messages-list__item-name">
                    <!-- {{ messageThread.name }} -->
                    {{ messageThreadName(messageThread) }}
                  </h2>
                  <!-- <p class="messages-list__item-preview">{{messageThread.latestMessage}}</p> -->
                  <p class="messages-list__item-preview">
                    {{ lastMessagePreview(messageThread) }}
                  </p>
                </div>
                <span class="messages-list__item-date">{{
                  lastMessageDate(messageThread)
                }}</span>
              </li>
            </ul>
            <ul v-else class="messages-list messages-list--manage">
              <li
                
                class="messages-list__item"
                :class="{
                  'messages-list__item--active': messageThread.messageActive,
                }"
                v-for="messageThread in messages"
                :key="messageThread.id"
                tabindex="0"
                role="button"
              >
                <div
                  v-if="
                    messageThread.users.length == 2 &&
                    messageThreadImage(messageThread) == true
                  "
                  class="messages-list__item-img"
                >
                  <img
                    :src="
                      'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                      usersInGroup(messageThread)
                    "
                    alt=""
                  />
                </div>
                <div
                  v-if="
                    messageThread.users.length == 2 &&
                    messageThreadImage(messageThread) == false
                  "
                  class="messages-list__item-img messages-list__item-img messages-list__item-img--fallback"
                >
                  {{ usersInGroup(messageThread) }}
                </div>
                <div
                  v-else-if="messageThread.users.length !== 2"
                  class="messages-list__item-img messages-list__item-img--group"
                ></div>

                <div class="messages-list__item-details">
                  <!-- <h2 class="messages-list__item-name"><span v-for="recipientName in messageThread.messageRecipientNames" :key="recipientName + messageID">{{recipientName}}</span></h2> -->
                  <h2 class="messages-list__item-name">
                    <!-- {{ messageThread.name }} -->
                    {{messageThreadName(messageThread)}}
                  </h2>
                  <!-- <p class="messages-list__item-preview">{{messageThread.latestMessage}}</p> -->
                  <p class="messages-list__item-preview">
                    {{ lastMessagePreview(messageThread) }}
                  </p>
                </div>

                <base-icon-button
                  @click="messageForDeletion(messageThread)"
                  @keypress.enter="messageForDeletion(messageThread)"
                  mode="icon-button icon-button--trash"
                  ariaLabel="delete this message"
                ></base-icon-button>

                <!-- <div
                  class="group-contacts-list__item-checked-status contacts-list__item-checked-status--checked"
                  v-if="deleteMessagesIDs.includes(messageThread)"
                ></div>
                <div
                  class="group-contacts-list__item-checked-status"
                  v-else
                ></div> -->
              </li>
            </ul>
          </div>
          <div
            v-if="
              !messagesLoading &&
              messages.length === 0 &&
              searchMessageValue === ''
            "
            class="no-messages"
          >
            <strong>You currently have no messages.</strong>
          </div>
          <div
            v-else-if="
              !messagesLoading &&
              messages.length === 0 &&
              searchMessageValue !== ''
            "
            class="no-messages"
          >
            <strong>No contacts match that search.</strong>
          </div>
        </section>

        <section v-else-if="contactsListVisible">
          <div class="messages-header">
            <!-- <base-icon-button
              @click="showMessageList"
              mode="icon-button icon-button--back"
              ariaLabel="back to messages"
            ></base-icon-button> -->
            <h1 class="h3" v-if="contactsToBlock">Block Contacts</h1>
            <h1 class="h3" v-else-if="contactsToDelete">Delete Contacts</h1>
            <h1 class="h3" v-else>New Chat</h1>
            <div class="messages-header__button-container">
              <base-text-icon-button
                @click="showMessageList"
                mode="text-icon-button text-icon-button--back"
                ><span class="sr-text">Chats</span></base-text-icon-button
              >
              <base-text-icon-button
                @click="showContactsOptions"
                mode="text-icon-button text-icon-button--ellipsis"
                aria-label="manage contacts"
                ><span class="sr-text">Manage</span></base-text-icon-button
              >
              <transition>
                <base-dialog
                  @closeDialog="hideContactsOptions"
                  v-if="isContactsOptionsDisplayed"
                >
                  <strong>Contacts Options</strong>
                  <base-text-icon-button
                    @click="selectContactsToBlock"
                    mode="text-icon-button text-icon-button--block"
                    >Block Contacts</base-text-icon-button
                  >
                  <base-text-icon-button
                    @click="selectContactsToDelete"
                    mode="text-icon-button text-icon-button--trash"
                    >Delete Contacts</base-text-icon-button
                  >
                </base-dialog>
              </transition>
            </div>
          </div>
          <search-bar
            @searched="searchContacts"
            v-if="contacts.length > 0"
            searchId="searchContacts"
            ariaLabel="search contacts"
            searchPlaceholder="Search Contacts"
          ></search-bar>
          <div>
            <ul v-if="contactsToBlock" class="contacts-list contacts-list--manage">
              <!-- <li
                @click="startGroupMessage"
                class="contacts-list__item contacts-list__item--new-group"
              >
                New Group Chat
              </li> -->
              <li
                @click="contactForBlocking(contact)"
                @keypress.enter="contactForBlocking(contact)"
                class="contacts-list__item"
                v-for="contact in alphabetisedContacts"
                :key="contact.id"
                tabindex="0"
                role="button"
              >
                <div v-if="contact.avatar_url" class="contacts-list__item-img">
                  <img
                    :src="
                      'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                      contact.avatar_url
                    "
                    alt=""
                  />
                </div>
                <div
                  v-else
                  class="contacts-list__item-img contacts-list__item-img--fallback"
                >
                  {{ contact.name.slice(0, 1) }}
                </div>

                <div class="messages-list__item-details">
                  <h2 class="messages-list__item-name">{{ contact.name }}</h2>
                </div>
                <div
                  class="group-contacts-list__item-checked-status contacts-list__item-checked-status--checked"
                  v-if="blockContactsIDs.includes(contact)"
                ></div>
                <div
                  class="group-contacts-list__item-checked-status"
                  v-else
                ></div>
              </li>
            </ul>
            <ul v-else-if="contactsToDelete" class="contacts-list contacts-list--manage">
              <!-- <li
                @click="startGroupMessage"
                class="contacts-list__item contacts-list__item--new-group"
              >
                New Group Chat
              </li> -->
              <li
                @click="contactForDeletion(contact)"
                @keypress.enter="contactForDeletion(contact)"
                class="contacts-list__item"
                v-for="contact in alphabetisedContacts"
                :key="contact.id"
                tabindex="0"
                role="button"
              >
                <div v-if="contact.avatar_url" class="contacts-list__item-img">
                  <img
                    :src="
                      'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                      contact.avatar_url
                    "
                    alt=""
                  />
                </div>
                <div
                  v-else
                  class="contacts-list__item-img contacts-list__item-img--fallback"
                >
                  {{ contact.name.slice(0, 1) }}
                </div>
                <div class="messages-list__item-details">
                  <h2 class="messages-list__item-name">{{ contact.name }}</h2>
                </div>
                <div
                  class="group-contacts-list__item-checked-status contacts-list__item-checked-status--checked"
                  v-if="deleteContactsIDs.includes(contact)"
                ></div>
                <div
                  class="group-contacts-list__item-checked-status"
                  v-else
                ></div>
              </li>
            </ul>

            <ul v-else class="contacts-list">
              <li
                role="button"
                tabindex="0"
                @click="startGroupMessage"
                @keypress.enter="startGroupMessage"
                class="contacts-list__item contacts-list__item--new-group"
              >
                New Group Chat
              </li>
              <li
                @click="startChat(contact.id)"
                @keypress.enter="startChat(contact.id)"
                class="contacts-list__item"
                v-for="contact in alphabetisedContacts"
                :key="contact.id"
                tabindex="0"
                role="button"
              >
                <div v-if="contact.avatar_url" class="contacts-list__item-img">
                  <img
                    :src="
                      'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                      contact.avatar_url
                    "
                    alt=""
                  />
                </div>
                <div
                  v-else
                  class="contacts-list__item-img contacts-list__item-img--fallback"
                >
                  {{ contact.name.slice(0, 1) }}
                </div>
                <div class="messages-list__item-details">
                  <h2 class="messages-list__item-name">{{ contact.name }}</h2>
                </div>
              </li>
            </ul>
          </div>
          <div
            v-if="
              alphabetisedContacts.length === 0 && searchContactValue === ''
            "
            class="no-messages"
          >
            <strong>You currently have no contacts.</strong>
          </div>
          <div
            v-else-if="
              alphabetisedContacts.length === 0 && searchContactValue !== ''
            "
            class="no-messages"
          >
            <strong>No contacts match that search.</strong>
          </div>
        </section>

        <section v-else-if="groupContactsListVisible">
          <div class="messages-header">
            <!-- <base-icon-button
              @click="showContacts"
              mode="icon-button icon-button--back"
              ariaLabel="back to contacts"
            ></base-icon-button> -->
            <h1 class="h3">New Group Chat</h1>
            <div class="messages-header__button-container">
              <base-text-icon-button
                @click="showContacts"
                mode="text-icon-button text-icon-button--back"
                ><span class="sr-text">Contacts</span></base-text-icon-button
              >
            </div>
          </div>
          <search-bar
            @searched="searchContacts"
            v-if="contacts.length > 0"
            searchId="searchContacts"
            ariaLabel="search contacts"
            searchPlaceholder="Search Contacts"
          ></search-bar>
          <div>
            <ul class="group-contacts-list group-contacts-list--manage">
              <li
                @click="addGroupRecipient(contact.id)"
                @keypress.enter="addGroupRecipient(contact.id)"
                class="group-contacts-list__item"
                v-for="contact in alphabetisedContacts"
                :key="contact.id"
                tabindex="0"
                role="checkbox"
                :aria-checked="
                  groupChatContactsIDs.includes(contact.id) ? 'true' : 'false'
                "
                :aria-labelledby="contact.id + '-checkbox'"
              >
                <div v-if="contact.avatar_url" class="contacts-list__item-img">
                  <img
                    :src="
                      'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                      contact.avatar_url
                    "
                    alt=""
                  />
                </div>
                <div
                  v-else
                  class="contacts-list__item-img contacts-list__item-img--fallback"
                >
                  {{ contact.name.slice(0, 1) }}
                </div>
                <div class="group-contacts-list__item-details">
                  <span class="sr-only" :id="contact.id + '-checkbox'">
                    Add {{ contact.name }} to group chat
                  </span>
                  <h2 class="group-contacts-list__item-name">
                    {{ contact.name }}
                  </h2>
                  <div
                    class="group-contacts-list__item-checked-status contacts-list__item-checked-status--checked"
                    v-if="groupChatContactsIDs.includes(contact.id)"
                  ></div>
                  <div
                    class="group-contacts-list__item-checked-status"
                    v-else
                  ></div>
                </div>
              </li>
            </ul>
          </div>
          <div
            v-if="
              alphabetisedContacts.length === 0 && searchContactValue === ''
            "
            class="no-messages"
          >
            <strong>You currently have no contacts.</strong>
          </div>
          <div
            v-else-if="
              alphabetisedContacts.length === 0 && searchContactValue !== ''
            "
            class="no-messages"
          >
            <strong>No contacts match that search.</strong>
          </div>
        </section>

        <!-- <div class="delete-messages-count" v-if="messagesToDelete">
          <span
            >{{ deleteMessagesCount }} message<span
              v-if="deleteMessagesIDs.length > 1"
              >s</span
            >
            selected</span
          >
          <ul class="delete-messages-count__list">
            <li
              class="delete-messages-count__list-item"
              v-for="message in deleteMessagesIDs"
              :key="message.messageID"
            >
              <div v-if="message.users.length === 2">
                <div v-for="user in message.users" :key="user.id">
                  <div
                    class="delete-messages-count__list-item--fallback"
                    v-if="user.id !== thisUserID && user.avatar_url == null"
                  >
                    {{ user.name.slice(0, 1) }}
                  </div>
                  <img
                    v-else-if="
                      user.id !== thisUserID && user.avatar_url !== null
                    "
                    :src="
                      'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                      user.avatar_url
                    "
                    alt=""
                  />
                </div>
              </div>
              <div class="delete-messages-count__list-item--group" v-else></div>
            </li>
          </ul>
          <base-button
            v-if="deleteMessagesIDs.length >= 1"
            @click="deleteSelectedMessages"
            role="button"
            mode="cta cta--primary"
            >Delete Message<span v-if="deleteMessagesIDs.length > 1"
              >s</span
            ></base-button
          >
        </div> -->

        <div class="block-contacts-count" v-if="contactsToBlock">
          <span
            >{{ blockContactsCount }} Contact<span
              v-if="blockContactsIDs.length > 1"
              >s</span
            >
            Selected</span
          >
          <ul class="block-contacts-count__list">
            <li
              class="block-contacts-count__list-item"
              v-for="contact in blockContactsIDs"
              :key="contact.id"
            >
              <img
                v-if="contact.avatar_url"
                :src="
                  'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                  contact.avatar_url
                "
                alt=""
              />
              <div v-else class="group-chat-start__list-item--fallback">
                {{ contact.name.slice(0, 1) }}
              </div>
            </li>
          </ul>
          <base-button
            @click="blockSelectedContacts"
            v-if="blockContactsIDs.length >= 1"
            role="button"
            mode="cta cta--primary"
            >Block Contact<span v-if="blockContactsIDs.length > 1"
              >s</span
            ></base-button
          >
        </div>

        <div class="delete-contacts-count" v-if="contactsToDelete">
          <span
            >{{ deleteContactsCount }} Contact<span
              v-if="deleteContactsIDs.length > 1"
              >s</span
            >
            Selected</span
          >
          <ul class="delete-contacts-count__list">
            <li
              class="delete-contacts-count__list-item"
              v-for="contact in deleteContactsIDs"
              :key="contact.id"
            >
              <img
                v-if="contact.avatar_url"
                :src="
                  'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                  contact.avatar_url
                "
                alt=""
              />
              <div v-else class="group-chat-start__list-item--fallback">
                {{ contact.name.slice(0, 1) }}
              </div>
            </li>
          </ul>
          <base-button
            @click="deleteSelectedContacts"
            v-if="deleteContactsIDs.length >= 1"
            role="button"
            mode="cta cta--primary"
            >Delete Contact<span v-if="deleteContactsIDs.length > 1"
              >s</span
            ></base-button
          >
        </div>

        <div class="group-chat-start" v-if="groupChatContacts.length > 1">
          <base-input
            inputId="groupName"
            inputType="text"
            v-model="groupChatName"
            :isRequired="true"
          >
            <template #label>Group Subject</template>
          </base-input>
          <base-button
            :disabled="!groupChatName"
            @click="startChat(groupChatContactsIDs)"
            role="button"
            mode="cta cta--primary"
            >Start Group Chat</base-button
          >
          <hr />
          <span v-if="groupChatContacts.length === 1"
            >{{ groupChatCount }} Contact Selected</span
          >
          <span v-else>{{ groupChatCount }} Contacts Selected</span>
          <ul class="group-chat-start__list">
            <li
              class="group-chat-start__list-item"
              v-for="contact in groupChatContacts"
              :key="contact.id"
            >
              <img
                v-if="contact.avatar_url"
                :src="
                  'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                  contact.avatar_url
                "
                alt=""
              />
              <div v-else class="group-chat-start__list-item--fallback">
                {{ contact.name.slice(0, 1) }}
              </div>
            </li>
          </ul>
        </div>

        <section v-if="newMessage" class="active-messages active-messages--new">
          <div class="active-messages__header">
            <!-- <base-button
              @click="cancelMessage"
              buttonType="button"
              mode="active-messages__cancel-btn"
              >Cancel <span class="sr-only">new chat</span></base-button
            > -->
            <button ref="firstButtonFocus" @click="cancelMessage" class="active-messages__cancel-btn">Cancel <span class="sr-only">new chat</span></button>
            <h3 class="messages-list__item-name">{{ chatName }}</h3>
          </div>
          <ul class="active-messages__messages-list">
            <li
              v-for="message in selectedMessagesArray.slice().reverse()"
              :key="message.id"
              :class="[
                'active-messages__message',
                thisUserID === message.user_id
                  ? 'active-messages__message--user'
                  : 'active-messages__message--recipient',
                message.doubleMessage ? 'active-messages__message--double' : '',
                messages.messageSenderID === 'memberLeftGroup'
                  ? 'active-messages__message--member-left'
                  : '',
                messages.messageSenderID === 'dateSent'
                  ? 'active-messages__message--date-sent'
                  : '',
              ]"
            >
              <span class="active-messages__message-sender">{{
                nameMatch(message)
              }}</span>
              <span class="active-messages__message-copy">{{
                message.message
              }}</span>
              <span class="active-messages__message-time">{{
                message.created_time
              }}</span>
            </li>
          </ul>
          <div class="new-message-input-container">
            <new-message-input
              @sendNewMessage="submitStartChat"
              ariaLabel="Send new message"
              inputId="newMessage"
            ></new-message-input>
          </div>
        </section>

        <section v-if="messagesSelected" class="active-messages">
          <div class="active-messages__header">
            <base-icon-button
              @click="closeMessage"
              buttonType="button"
              mode="icon-button icon-button--back"
              ariaLabel="close message"
            ></base-icon-button>
            <!-- <h3 class="messages-list__item-name">{{ chatName }}</h3> -->
            <h3 class="messages-list__item-name">{{oneToOneChatName()}}</h3>

            <!-- <base-icon-button
              @click="manageActiveMessage"
              buttonType="button"
              mode="icon-button icon-button--ellipsis"
              ariaLabel="more options"
            ></base-icon-button> -->
            <button @click="manageActiveMessage" ref="firstButtonFocus" class="icon-button icon-button--ellipsis" ariaLabel="more options"><span class="sr-text">Show options</span></button>
          </div>
          <transition>
            <base-dialog
              @closeDialog="hideActiveMessageOptions"
              v-if="isActiveMessageOptionsDisplayed"
            >
              <strong>Chat Options</strong>
              <base-text-icon-button
                v-if="selectedMessagesUsers.length > 2"
                @click="leaveGroup"
                @keypress.enter="leaveGroup"
                mode="text-icon-button text-icon-button--logout"
                >Leave Group</base-text-icon-button
              >
              <base-text-icon-button
                v-else
                @click="blockSender"
                mode="text-icon-button text-icon-button--block"
                >Block Sender</base-text-icon-button
              >
              <base-text-icon-button
                @click="deleteActiveMessage"
                @keypress.enter="deleteActiveMessage"
                mode="text-icon-button text-icon-button--trash"
                >Delete Chat</base-text-icon-button
              >
              <div v-if="selectedMessagesUsers.length > 2">
                <hr />
                <strong>Group Members</strong>
                <ul class="message-option-list">
                  <li v-for="user in selectedMessagesUsers" :key="user.id">
                    <img
                      v-if="user.avatar_url"
                      class="avatar-image"
                      :src="
                        'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/' +
                        user.avatar_url
                      "
                      :alt="user.name + ' avatar image'"
                    />
                    <div v-else class="avatar-image avatar-image--fallback">
                      {{ user.name.slice(0, 1) }}
                    </div>
                    {{ user.name }}
                  </li>
                </ul>
              </div>
            </base-dialog>
          </transition>
          <ul class="active-messages__messages-list" tabindex="0">
            <li
              v-for="message in selectedMessagesArray.slice().reverse()"
              :key="message.id"
              :class="[
                'active-messages__message',
                thisUserID === message.user_id
                  ? 'active-messages__message--user'
                  : 'active-messages__message--recipient',
                message.doubleMessage ? 'active-messages__message--double' : '',
                messages.messageSenderID === 'memberLeftGroup'
                  ? 'active-messages__message--member-left'
                  : '',
                messages.messageSenderID === 'dateSent'
                  ? 'active-messages__message--date-sent'
                  : '',
              ]"
            >
              <span class="active-messages__message-sender">{{
                nameMatch(message)
              }}</span>
              <span class="active-messages__message-copy">{{
                message.message
              }}</span>
              <span class="active-messages__message-time">{{
                message.created_time
              }}</span>
            </li>
          </ul>
          <div class="new-message-input-container">
            <new-message-input
             
              @sendNewMessage="submitNewMessage"
              ariaLabel="Send new message"
              inputId="newMessage"
            ></new-message-input>
            
          </div>
        </section>
      </div>
    </main>


    <transition>
      <base-dialog mode="modal-dialog modal-dialog--warning modal-dialog--login-warning" v-if="!$store.state.loggedIn">
        <strong>Your session has expired</strong>
        <p>Log in to access this page</p>
        <router-link class="cta cta--primary" to="/login"><span class="header-link__text">Log In</span></router-link>
      </base-dialog>
      </transition>
    <the-footer></the-footer>
  </div>
</template>

<script>
import axios from "axios";
import TheHeader from "../components/layouts/TheHeader.vue";
import TheFooter from "../components/layouts/TheFooter.vue";
import BaseButton from "../components/UI/BaseButton.vue";
import BaseTextIconButton from "../components/UI/BaseTextIconButton.vue";
import BaseIconButton from "../components/UI/BaseIconButton.vue";
import NewMessageInput from "../components/UI/NewMessageInput.vue";
import SearchBar from "../components/UI/SearchBar.vue";
import BaseInput from "../components/UI/BaseInput.vue";
import BaseDialog from "../components/UI/BaseDialog.vue";

export default {
  components: {
    TheHeader,
    TheFooter,
    BaseButton,
    BaseTextIconButton,
    NewMessageInput,
    BaseIconButton,
    SearchBar,
    BaseInput,
    BaseDialog,
  },
  props: ["profileID"],
  data() {
    return {
      searchMessageValue: "",
      searchContactValue: "",
      messagesLoading: true,
      messagesListVisible: true,
      messagesSelected: false,
      newMessage: false,
      thisUserID: this.$store.state.userID,
      thisUserName: "Down To Folk",
      thisUserNewMessage: "",
      thisUserNewMessageDate: "",
      thisUserNewMessageTime: "",
      messageID: "",
      messageRecipientNames: [],
      messageRecipientIDs: [],
      chatName: "",
      newChatID: "",
      selectedMessagesArray: [],
      selectedMessagesUsers: [],
      //selectedMessageLatestSender: '',
      contactsListVisible: false,
      groupContactsListVisible: false,
      groupChatContacts: [],
      groupChatContactsIDs: [],
      //the above is very hacky
      groupChatCount: 0,
      groupChatName: "",
      groupContactsIDs:[],
      //newGroupMessage: false,
      isMessagesOptionsDisplayed: false,
      messagesToDelete: false,
      //deleteMessagesIDs: [],
      //deleteMessagesCount: 0,
      isContactsOptionsDisplayed: false,
      contactsToBlock: false,
      blockContactsIDs: [],
      blockContactsCount: 0,
      contactsToDelete: false,
      deleteContactsIDs: [],
      deleteContactsCount: 0,
      isActiveMessageOptionsDisplayed: false,
      contacts: [],
      messages: [],
    };
  },
  methods: {
    cancelActiveMessage() {
      this.selectedMessagesArray = [];
      for (let i = 0; i < this.messages.length; i++) {
        this.messages[i].messageActive = false;
      }
      this.messageRecipientNames = [];
    },
    closeMessage() {
      this.messagesSelected = false;
      this.contactsListVisible = false;
      this.messagesListVisible = true;
      this.cancelActiveMessage();
    },
    selectedMessage(val) {
      this.cancelActiveMessage();
      const chosenMessage = this.messages.find((message) => message.id === val);
      chosenMessage.messageActive = true;
      this.messagesSelected = true;
      this.messagesListVisible = true;
      this.groupContactsListVisible = false;
      this.newMessage = false;
      this.chatName = chosenMessage.name;
      this.selectedMessagesUsers = chosenMessage.users;
      this.$nextTick(function () {
        this.$refs.firstButtonFocus.focus()
      })
      axios.get("api/get_group/" + chosenMessage.id).then((res) => {
        this.selectedMessagesArray = res.data.messages;
        this.selectedMessagesUsers = res.data.users;

        if (this.selectedMessagesArray && this.selectedMessagesArray.length) {
          this.selectedMessagesArray.map(function (value, index, elements) {
            let next = elements[index + 1];

            if (elements.length - 1 === index) {
              // do nothing
            } else if (value.user_id === next.user_id) {
              value.doubleMessage = true;
            }
          });
        }
      });
    },
    nameMatch(val) {
      let userName = "";

      for (let i = 0; i < this.selectedMessagesUsers.length; i++) {
        if (val.user_id == this.selectedMessagesUsers[i].id) {
          userName = this.selectedMessagesUsers[i].name;
        }
      }

      return userName;
    },

    usersInGroup(val) {
      for (let i = 0; i < val.users.length; i++) {
        if (val.users[i].id !== this.$store.state.userID) {
          if (val.users[i].avatar_url == null) {
            return val.users[i].name.slice(0, 1);
          } else {
            return val.users[i].avatar_url;
          }
        }
      }
    },

    messageThreadImage(val) {
      for (let i = 0; i < val.users.length; i++) {
        const userID = val.users[i].id;
        if (userID !== this.thisUserID) {
          const user = val.users[i];

          if (user.avatar_url) {
            return true;
          } else {
            return false;
          }
        }
      }
    },

    messageThreadName(val){
      for (let i = 0; i < val.users.length; i++) {
        if (val.users.length == 2){
          const recipientName = val.users.find(user => user.id !== this.thisUserID).name
          return recipientName
        }else{
          return val.name
        }
      }
    },

    lastMessagePreview(val) {
      for (let i = 0; i < val.messages.length; i++) {
        return val.messages[i].message;
      }
    },

    lastMessageDate(val) {
      for (let i = 0; i < val.messages.length; i++) {
        return val.messages[i].created_date;
        //this needs to be date and month!
      }
    },

    oneToOneChatName(){
      const usersInGroup = this.selectedMessagesUsers
      for (let i = 0; i < usersInGroup.length; i++) {
        if (usersInGroup.length == 2){
          const recipientName = usersInGroup.find(user => user.id !== this.thisUserID).name
          return recipientName
        }else{
          return this.chatName
        }
      }
    },

    submitStartChat(val) {
      this.thisUserNewMessage = val;
      if(this.groupChatContactsIDs.length > 1){
          axios
        .post("/api/create_group", {
          name: this.chatName,
          users:this.groupChatContactsIDs
        })
        .then((res) => {
          this.groupChatContactsIDs = [];
          this.newChatID = res.data.id;
          axios
            .post("api/add_message", {
              group_id: this.newChatID,
              message: this.thisUserNewMessage,
            })
            .then(() => {
              axios.get("api/get_groups").then((res) => {
                this.thisUserNewMessage = "";
                this.messages = res.data;
                this.newMessage = false;
                this.selectedMessage(this.newChatID);
                this.newChatID = "";
              });
            });
        });
      }else{
        axios
        .post("/api/create_group", {
          name: this.$store.state.newContact.contactName,
          users: [this.$store.state.newContact.contactID],
        })
        .then((res) => {
          this.newChatID = res.data.id;
          axios
            .post("api/add_message", {
              group_id: this.newChatID,
              message: this.thisUserNewMessage,
            })
            .then(() => {
              axios.get("api/get_groups").then((res) => {
                this.thisUserNewMessage = "";
                this.messages = res.data;
                this.newMessage = false;
                this.selectedMessage(this.newChatID);
                this.newChatID = "";
              });
            });
        });
      }
   
    },

    submitNewMessage(val) {
      const latestMessageInfo = this.messages.find(
        (message) => message.messageActive == true
      );
      const currentMessageID = this.messages.find(
        (message) => message.messageActive == true
      ).id;

      const nth = function (d) {
        if (d > 3 && d < 21) return "th";
        switch (d % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString("default", {
        month: "short",
      });
      const currentDay = currentDate.getDay();
      const currentDayFormatted = currentDay + nth(currentDay);
      const currentDayMonth = currentDayFormatted + " " + currentMonth;
      this.thisUserNewMessage = val;

      if (this.thisUserNewMessage !== "" && this.thisUserNewMessage !== " ") {
        latestMessageInfo.latestMessage = this.thisUserNewMessage;
        latestMessageInfo.latestMessageDate = currentDayMonth;
        latestMessageInfo.latestMessageTimestamp = new Date().getTime();
        this.newMessage = false;
        axios
          .post("api/add_message", {
            group_id: currentMessageID,
            message: this.thisUserNewMessage,
          })
          .then(() => {
            axios.get("api/get_groups").then((res) => {
              this.messages = res.data;
              this.selectedMessage(currentMessageID);
              this.thisUserNewMessage = '';
            });
          });
      }
    },
    showContacts() {
      this.hideCounts();
      this.$nextTick(function () {
        this.$refs.messagesPageBody.classList.remove('add-recipients-active')
      })
      this.$nextTick(function () {
        this.$refs.messagesPageBody.classList.remove('manage-recipients-active')
      })
      this.groupChatContacts = [];
      this.groupChatContactsIDs = [];
      this.groupChatCount = 0;
      this.groupChatName = "";
      this.messageID = "";
      (this.messageRecipientNames = []),
        (this.messageRecipientIDs = []),
        (this.newMessage = false);
      this.cancelActiveMessage();
      this.contactsListVisible = true;
      this.groupContactsListVisible = false;
      this.messagesListVisible = false;
      this.messagesSelected = false;
    },
    showMessageList() {
      this.contactsListVisible = false;
      this.messagesListVisible = true;
      this.groupChatContacts = [];
      this.$nextTick(function () {
        this.$refs.messagesPageBody.classList.remove('add-recipients-active')
      })
      this.$nextTick(function () {
        this.$refs.messagesPageBody.classList.remove('manage-recipients-active')
      })
      this.hideCounts();
    },
    startGroupMessage() {
      this.contactsListVisible = false;
      this.groupContactsListVisible = true;
      this.messagesListVisible = false;
    },

    startChat(val) {
      this.cancelActiveMessage();
      if (typeof val === "string") {
        this.contactsListVisible = false;
        this.messagesListVisible = true;

        for (let i = 0; i < this.messages.length; i++) {
          let groupUsers = this.messages[i];
          let groupUsersIDs = this.messages[i].users;

          if (
            groupUsers.users.length === 2 &&
            groupUsersIDs.find((x) => x.id === val)
          ) {
            this.newMessage = false;
            this.selectedMessage(groupUsers.id);
            return true;
          }
        }

        this.newMessage = true;
        this.$nextTick(function () {
          this.$refs.firstButtonFocus.focus()
        })
        const chosenContact = this.contacts.find(
          (contact) => contact.id === val
        );
        this.messageRecipientNames = chosenContact.name;
        this.chatName = chosenContact.name;

        axios
          .post("/api/create_group", {
            name: chosenContact.name,
            users: [chosenContact.id],
          })
          .then((res) => {
            this.newChatID = res.data.id;
            axios.get("api/get_groups").then((res) => {
              this.messages = res.data;
            });
          });

        return true;
      } else {
        if (this.messages.find((message) => message.id === val)) {
          this.groupChatContacts = [];
          this.groupChatContactsIDs = [];
          this.groupChatCount = 0;
          this.groupChatName = "";
        } else {

           const groupContacts = [];
           const groupContactsIDs = this.groupContactsIDs;

           
          for (let i = 0; i < this.groupChatContacts.length; i++) {
            groupContacts.push("" + this.groupChatContacts[i].name + "");
          }
          for (let i = 0; i < this.groupChatContacts.length; i++) {
            groupContactsIDs.push("" + this.groupChatContacts[i].id + "");
          }

          

            const groupRecipientIDs = groupContactsIDs;
            groupRecipientIDs.push(this.thisUserID);

            this.groupContactsListVisible = false;
            this.newMessage = true;
            this.$nextTick(function () {
              this.$refs.firstButtonFocus.focus()
            })
            this.messagesListVisible = true;
            this.messageRecipientNames = groupContacts;
            this.groupChatContacts = [];
            this.chatName = this.groupChatName;
        }
      }
    },
    addGroupRecipient(val) {
      const groupArray = this.groupChatContacts;
      const groupIDsArray = this.groupChatContactsIDs;
      //the above is a little hacky
      const contact = this.contacts.find((contact) => contact.id === val);

      if (!groupArray.includes(contact)) {
        groupArray.push(contact);
        groupIDsArray.push(val);
        this.groupChatCount += 1;
      } else {
        groupArray.splice(groupArray.indexOf(contact), 1);
        groupIDsArray.splice(groupIDsArray.indexOf(val), 1);
        this.groupChatCount -= 1;
      }

      if(groupArray.length > 1){
        this.$nextTick(function () {
          this.$refs.messagesPageBody.classList.add('add-recipients-active')
        })
      }else{
        this.$nextTick(function () {
          this.$refs.messagesPageBody.classList.remove('add-recipients-active')
        })
      }
    },
    cancelMessage() {
      this.messages.shift();
      this.newMessage = false;
      this.cancelActiveMessage();

      axios.get("api/leave_group/" + this.newChatID).then((res) => {
        this.messages = res.data.messages;

        axios.get("api/get_groups").then((res) => {
          this.messages = res.data;
        });
      });

      this.chatName = "";

      this.groupContactsListVisible = true;
      this.groupChatContacts = [];
      this.groupChatContactsIDs = [];
      this.groupChatCount = 0;
      this.groupChatName = "";
    },
    showMessagesOptions() {
      this.isMessagesOptionsDisplayed = true;
    },
    hideMessagesOptions() {
      this.isMessagesOptionsDisplayed = false;
    },

    selectMessagesToDelete() {
      this.closeMessage();
      this.messagesToDelete = true;
      this.hideMessagesOptions();
    },
    messageForDeletion(val) {
      axios.get("api/leave_group/" + val.id).then(() => {
        axios.get("api/get_groups").then((res) => {
          this.messages = res.data;
          this.messagesToDelete = false;
          this.cancelActiveMessage();
          })
      });


      // const deleteMessagesArray = this.deleteMessagesIDs;
      // if (!deleteMessagesArray.includes(val)) {
      //   deleteMessagesArray.push(val);
      //   this.deleteMessagesCount += 1;
      // } else {
      //   deleteMessagesArray.splice(deleteMessagesArray.indexOf(val), 1);
      //   this.deleteMessagesCount -= 1;
      // }
    },

    // deleteSelectedMessages() {
    //   const messageArray = this.messages;
    //   this.messagesToDelete = false;
    //   this.deleteMessagesCount = 0;

    //   for (let i = 0; i < this.deleteMessagesIDs.length; i++) {
    //     let selectedMessage = this.deleteMessagesIDs[i];
    //     messageArray.splice(
    //       messageArray.findIndex((v) => v.messageID === selectedMessage),
    //       1
    //     );
    //   }
    //   this.deleteMessagesIDs = [];
    // },

    hideCounts() {
      this.contactsToBlock = false;
      this.blockContactsCount = 0;
      this.blockContactsIDs = [];
      this.contactsToDelete = false;
      this.deleteContactsCount = 0;
      this.deleteContactsIDs = [];
      this.messagesToDelete = false;
      // this.deleteMessagesCount = 0;
      // this.deleteMessagesIDs = [];
    },

    showContactsOptions() {
      this.isContactsOptionsDisplayed = true;
      this.contactsToBlock = false;
      this.hideCounts();
    },

    hideContactsOptions() {
      this.isContactsOptionsDisplayed = false;
    },

    selectContactsToBlock() {
      this.isContactsOptionsDisplayed = false;
      this.contactsToBlock = true;
    },

    contactForBlocking(val) {
      const blockContactsArray = this.blockContactsIDs;
      if (!blockContactsArray.includes(val)) {
        blockContactsArray.push(val);
        this.blockContactsCount += 1;
      } else {
        blockContactsArray.splice(blockContactsArray.indexOf(val), 1);
        this.blockContactsCount -= 1;
      }

      if(blockContactsArray.length > 0){
        this.$nextTick(function () {
          this.$refs.messagesPageBody.classList.add('manage-recipients-active')
        })
      }else{
        this.$nextTick(function () {
          this.$refs.messagesPageBody.classList.remove('manage-recipients-active')
        })
      }
    },

    blockSelectedContacts() {

      let arrayOfIDs = []
      this.contactsToBlock = false;
      this.blockContactsCount = 0;
      for (let i = 0; i < this.blockContactsIDs.length; i++) {
        arrayOfIDs.push(this.blockContactsIDs[i].id)        
      }
       axios.post("api/blockcontacts",{
        contacts: arrayOfIDs,
       }).then(() => {
        axios.get("api/get_contacts").then((res) => {
          this.contacts = res.data;
          arrayOfIDs = [];
          this.blockContactsIDs = [];
        })
      })
    },

    selectContactsToDelete() {
      this.isContactsOptionsDisplayed = false;
      this.contactsToDelete = true;
    },

    contactForDeletion(val) {
      const deleteContactsArray = this.deleteContactsIDs;
      if (!deleteContactsArray.includes(val)) {
        deleteContactsArray.push(val);
        this.deleteContactsCount += 1;
      } else {
        deleteContactsArray.splice(deleteContactsArray.indexOf(val), 1);
        this.deleteContactsCount -= 1;
      }

      if(deleteContactsArray.length > 0){
        this.$nextTick(function () {
          this.$refs.messagesPageBody.classList.add('manage-recipients-active')
        })
      }else{
        this.$nextTick(function () {
          this.$refs.messagesPageBody.classList.remove('manage-recipients-active')
        })
      }
    },

    deleteSelectedContacts() {
      let arrayOfIDs = []
      this.contactsToDelete = false;
      this.deleteContactsCount = 0;
      for (let i = 0; i < this.deleteContactsIDs.length; i++) {
        arrayOfIDs.push(this.deleteContactsIDs[i].id)        
      }
       axios.post("api/delete_contacts",{
        contacts: arrayOfIDs,
       }).then(() => {
        axios.get("api/get_contacts").then((res) => {
          this.contacts = res.data;
          arrayOfIDs = [];
          this.deleteContactsIDs = [];
        })
      })
      
    },

    manageActiveMessage() {
      this.isActiveMessageOptionsDisplayed = true;
    },

    hideActiveMessageOptions() {
      this.isActiveMessageOptionsDisplayed = false;
    },

    blockSender() {
      let contactToBlock = this.messages.find(
        (message) => message.messageActive == true
      ).id;

      axios.get("api/blockcontact/" + contactToBlock).then(() => {
        axios.get("api/get_contacts").then((res) => {
          this.contacts = res.data;
          contactToBlock = '';
          this.messagesSelected = false;
          this.isActiveMessageOptionsDisplayed = false;
          this.deleteActiveMessage();
        })
      })  
    },

    deleteActiveMessage() {
      const messageToDelete = this.messages.find(
        (message) => message.messageActive == true
      ).id;

       axios.get("api/leave_group/" + messageToDelete).then(() => {
        axios.get("api/get_groups").then((res) => {
          this.messages = res.data;
          this.messagesSelected = false;
          this.isActiveMessageOptionsDisplayed = false;
          })
      });
      // const messageArray = this.messages;
      // messageArray.splice(
      //   messageArray.findIndex((v) => v.messageID === messageToDelete),
      //   1
      // );
      
    },

    leaveGroup() {
      const groupToLeave = this.messages.find(
        (message) => message.messageActive == true
      ).id;
      axios
        .post("api/add_message", {
          group_id: groupToLeave,
          message: this.thisUserName + " left the group.",
        })
        .then(() => {
          axios.get("api/leave_group/" + groupToLeave).then(() => {
            axios.get("api/get_groups").then((res) => {
              this.messages = res.data;
              this.messagesSelected = false;
              this.isActiveMessageOptionsDisplayed = false;
              })
          });
        });
      
      // const activeMessageID = this.messages.find(
      //   (message) => message.messageActive == true
      // ).id;

      // console.log(activeMessageID)

      //  axios
      //     .post("api/add_message", {
      //       group_id: currentMessageID,
      //       message: this.thisUserNewMessage,
      //     })
      //     .then(() => {
      //       axios.get("api/get_groups").then((res) => {
      //         this.messages = res.data;
      //         this.selectedMessage(currentMessageID);
      //       });
      //     });
     // const activeMessageRecipientsIDArray = activeMessage.users;

      //console.log(activeMessageRecipientsIDArray)

      // for (let i = 0; i < activeMessageRecipientsIDArray.length; i++) {
      //   console.log(activeMessageRecipientsIDArray[i].id) 
      // }
      // const activeMessageRecipientsNamesArray =
      //   activeMessage.messageRecipientNames;

      // if (activeMessageRecipientsIDArray.includes(this.thisUserID)) {
      //   this.deleteActiveMessage();
      //   // activeMessage.recipientMessages.push({
      //   //   messageSenderID: "memberLeftGroup",
      //   //   message: this.thisUserName + " left the group.",
      //   // });
      //   activeMessageRecipientsIDArray.splice(
      //     activeMessageRecipientsIDArray.findIndex(
      //       (v) => v.recipientID === this.thisUserID
      //     ),
      //     1
      //   );
      //   activeMessageRecipientsNamesArray.splice(
      //     activeMessageRecipientsNamesArray.findIndex(
      //       (v) => v.recipientName === this.thisUserName
      //     ),
      //     1
      //   );
      // }




      // this.messagesSelected = false;
      // this.isActiveMessageOptionsDisplayed = false;
      // this.cancelActiveMessage();
    },
    searchContacts(val) {
      this.searchContactValue = val.toLowerCase();
    },

    getGroupsInterval() {
      setInterval(function () {
        axios.get("api/get_groups").then((res) => {
          this.messages = res.data;
        });
      }, 60000);
    },
  },
  computed: {
    alphabetisedContacts() {
      let unblockedContacts = this.contacts.filter(
        (contacts) => contacts.blocked == false
      );

      if (this.searchContactValue) {
        unblockedContacts = this.contacts.filter(
          (m) => m.name.toLowerCase().indexOf(this.searchContactValue) > -1 && m.blocked == false
        );
      }
      return unblockedContacts
      // return unblockedContacts
      //   .filter((unblockedContacts) => unblockedContacts.name.toLowerCase())
      //   .sort((a, b) => {
      //     if (a.name < b.name) return -1;
      //     if (a.name > b.name) return 1;
      //     return 0;
      //   });

    },
  },
  updated() {
    if (this.$el.querySelector(".active-messages__messages-list")) {
      const container = this.$el.querySelector(
        ".active-messages__messages-list"
      );
      container.scrollTop = container.scrollHeight;
    }
  },
  mounted() {
    if(!this.$store.state.loggedIn){
      this.$router.push('/');
    }
    // for (let i = 0; i < this.messages.length; i++) {
    //   if (this.messages[i].messageRead == false) {
    //   }
    // }

    axios.get("api/get_groups").then((res) => {
      this.messages = res.data;
      this.messagesLoading = false;

      axios.get("api/get_contacts").then((res) => {
        this.contacts = res.data;
        this.messagesLoading = false;

        if (this.$store.state.newContact.contactID) {
          this.contactsListVisible = false;
          this.messagesListVisible = true;

          for (let i = 0; i < this.messages.length; i++) {
            let groupUsers = this.messages[i];
            let groupUsersIDs = this.messages[i].users;

            if (
              groupUsers.users.length === 2 &&
              groupUsersIDs.find(
                (x) => x.id === this.$store.state.newContact.contactID
              )
            ) {
              this.newMessage = false;
              this.selectedMessage(groupUsers.id);

              return true;
            } else {
              this.newMessage = true;
              this.chatName = this.$store.state.newContact.contactName;
              const chosenContact = this.$store.state.newContact;
              this.messageRecipientNames = chosenContact.contactName;
              this.messageID = chosenContact.contactID;
            }
          }

          if(this.messages.length === 0){
           //this is needed if there are no groups/messages already
            this.newMessage = true;
              this.chatName = this.$store.state.newContact.contactName;
              const chosenContact = this.$store.state.newContact;
              this.messageRecipientNames = chosenContact.contactName;
              this.messageID = chosenContact.contactID;
          }
        }
      });
    });

    this.getGroupsInterval();
  },
};
</script>

<style lang="scss" scoped>
.messages-page {
  background-color: $copy;
  overflow: auto;

  @media (min-width: $desktop) {
    background-color: transparent;
    grid-auto-rows: auto 1fr auto;
  }
}

.page-container {
  padding-top: $spacing-s;

  @media (min-width: $desktop) {
    padding-top: $spacing-m;
    padding-bottom: $spacing-m;
  }
}

.add-recipients-active{
  padding-bottom:rem(300);
  @media (min-width: $desktop){
    padding-bottom: $spacing-m;
  }
}
.manage-recipients-active{
  padding-bottom:rem(160);
  @media (min-width: $desktop){
    padding-bottom: $spacing-m;
  }
}
header,
footer {
  display: none;

  @media (min-width: $desktop) {
    display: block;
  }
}

.avatar-image {
  border-radius: 100%;
  overflow: hidden;
  text-indent: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &--fallback {
    background-color: #2a8470;
    color: #fff;
    font-weight: 600;
  }
}

.page-grid {
  @media (min-width: $desktop) {
    display: grid;
    grid-template-columns: 400px 1fr;
  }
}

.messages-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1 0 auto;

  @media (min-width: $desktop) {
    display: block;
    padding-right: $spacing-m;
  }

  &__back-link {
    width: rem(44);
    height: rem(44);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: 300;
    font-size: rem(20);

    @media (min-width: $desktop) {
      display: none;
    }

    &:before {
      font-family: "Font Awesome 5 Pro";
      content: "\f060";
    }
  }

  > .icon-button--back {
    background-color: transparent;
    color: #fff;
    @media (min-width: $desktop) {
      display: none;
    }
  }

  h1 {
    color: #fff;
    font-size: $copy-mobile-m;

    @media (min-width: $desktop) {
      color: $copy;
      font-size: $copy-desktop-m;
    }
  }

  &__button-container {
    display: flex;

    @media (min-width: $desktop) {
      margin-top: $spacing-s;
      justify-content: space-between;
      background-color: $lightgrey;
      border-radius: $border-radius-reg;
      padding: $spacing-xs $spacing-s;
      position: relative;
    }

    .text-icon-button--back {
        color: #fff;
        width: rem(44);
        justify-content: center;

      @media (min-width: $desktop) {
        width: auto;
        color: $copy;
       // display: flex;
        padding: 0 $spacing-s;
        font-size: $copy-desktop-s;
        border-radius: $border-radius-reg;

        .sr-text{
          @include cancel-sr-text;
        }

        &:hover{
          background-color: $lightergrey;
        }

        &:before{
          margin-right: $spacing-xs;
        }
      }
    }

    dialog {
      @media (min-width: $desktop) {
        right: 0;
        left: auto;
        top: 100%;
      }
    }
  }

  .text-icon-button--new-message,
  .text-icon-button--ellipsis {
    color: #fff;
    width: rem(44);
    justify-content: center;

    @media (min-width: $desktop) {
      width: auto;
      color: $copy;
      text-indent: 0; 
      padding: 0 $spacing-s;
      font-size: $copy-desktop-s;
      border-radius: $border-radius-reg;

      &:hover{
        background-color: $lightergrey;
      }
     

      .sr-text {
        clip: initial;
        -webkit-clip-path: initial;
        clip-path: initial;
        height: auto;
        width: auto;
        margin: 0;
        overflow: initial;
        padding: 0;
        position: relative;
      }
    }

    &:before {
      text-align: center;
      margin-right: 0;

      @media (min-width: $desktop) {
        color: $copy;
        margin-right: $spacing-xs;
      }
    }
  }
}

.search-bar-container {
  margin-top: $spacing-xs;

  @media (min-width: $desktop) {
    margin-top: $spacing-s;
    margin-right: $spacing-m;
  }
}

.messages-loading {
  display: flex;
  justify-content: center;
  padding-top: $spacing-xl;
  color: #fff;
  @media (min-width: $desktop) {
    padding-right: $spacing-m;
    color: $copy;
  }
}

.messages-list,
.contacts-list,
.group-contacts-list {
  @media (min-width: $desktop) {
    overflow-y: auto;
    max-height: rem(410);
    padding-right: $spacing-m;
  }

  &__item {
    color: #fff;
    display: flex;
    align-items: center;
    border-top: rem(1) solid $dark-green;
    padding: $spacing-s 0;
    cursor: pointer;
    transition: background-color .25s ease-in-out;

     @media(min-width:$desktop){
      &:hover{
        background-color: $lightergrey;
      }
    }

    @media (min-width: $desktop) {
      color: $copy;
      padding-left: $spacing-s;
      padding-right: $spacing-s;
    }

    &:first-of-type {
      border-top: none;
      margin-top: $spacing-s;
    }

    &--active {
      @media (min-width: $desktop) {
        color: #fff;
        background-color: $copy;
        border-top-left-radius: $border-radius-reg;
        border-bottom-left-radius: $border-radius-reg;
        position: relative;
        margin-right: rem(-32);
        padding-right: rem(48);

        &:hover{
          background-color: $copy;
        }
      }
    }

    &--new-group {
      font-size: $copy-mobile;

      &:before {
        content: "\f0c0";
        color: #fff;
        background-color: $dark-green;
        font-family: "Font Awesome 5 Pro";
        font-weight: 100;
        width: rem(36);
        height: rem(36);
        margin-right: $spacing-s;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &-checked-status {
      background-color: $lightgrey;
      width: rem(25);
      height: rem(25);
      position: relative;
      border-radius: 100%;
      margin-left: $spacing-s;
      cursor:pointer;

      &--checked:before {
        border-radius: 100%;
        position: absolute;
        height: rem(21);
        width: rem(21);
        content: "";
        left: rem(2);
        top: rem(2);
        background-color: $dark-green;
      }
    }
  }

  &__item-img {
    flex: 0 0 rem(36);
    height: rem(36);
    overflow: hidden;
    border-radius: 100%;
    justify-content: center;
    align-items: center;
    display: flex;

    &--group,
    &--fallback {
      background-color: #2a8470;
      color: #fff;
    }

    &--group {
      &:before {
        font-family: "Font Awesome 5 Pro";
        font-weight: 300;
        font-size: $copy-mobile;
        content: "\f0c0";
      }
    }

    &--fallback {
      font-weight: 600;
      text-transform: capitalize;
    }
  }

  &__item-details {
    overflow: hidden;
    padding-left: $spacing-s;
    flex: 1;
  }

  &__item-name {
    font-size: $copy-mobile;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: capitalize;

    span {
      margin-right: $spacing-xs;

      &:after {
        content: ",";
      }

      &:last-of-type {
        margin-right: 0;

        &:after {
          content: "";
        }
      }
    }
  }

  &__item-preview {
    color: #fff;
    font-size: $copy-mobile-s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: $desktop) {
      color: $copy;
      font-size: $copy-desktop-s;
    }
  }

  &__item-date {
    flex: 0 0 rem(60);
    text-align: right;
    font-size: $copy-mobile-xs;

    @media (min-width: $desktop) {
      font-size: $copy-desktop-xs;
      flex: 0 0 rem(70);
    }
  }

  .icon-button--trash{
    background-color: transparent;
    color:#fff;
    @media (min-width: $desktop) {
      background-color: #fff;
      color:$copy;
    }
  }

  &--manage{
    .messages-list__item:hover,
    .contacts-list__item:hover,
    .group-contacts-list__item:hover{
      cursor: default;
      background-color:transparent;
    }
  }
}

.group-contacts-list__item-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.messages-list__item--active .messages-list__item-preview {
  @media (min-width: $desktop) {
    color: #fff;
  }
}

.messages-list__item--active + .messages-list__item {
  border-top: none;
}

.active-messages {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: $copy;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: $desktop) {
    position: relative;
    border-radius: $border-radius-reg;
    max-height: rem(535);
    height: 100%;
    min-height: rem(550);
    min-width:0;
  }

  &__header {
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: $spacing-s;
    border-bottom: rem(1) solid $dark-green;
    position: relative;

    @media (min-width: $desktop) {
      padding: $spacing-s $spacing-m;
      overflow: visible;
    }

    .icon-button {
      width:rem(44);
      height: rem(44);
      border: rem(2) solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      color: #fff;

      &:hover{
        border-color: $dark-green;
      }


      &:before{
        font-family: "Font Awesome 5 Pro";
        font-weight: 300;
        text-align: center;
      }

      &--ellipsis{
        &:before{
          content:'\f141';
          font-size: rem(30);
        }
      }
    }

    .icon-button--back {
      @media (min-width: $desktop) {
        display: none;
      }
    }

    h3 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: $copy-mobile;
      flex: 1;
      text-align: center;
      padding-left: $spacing-s;
      padding-right: $spacing-s;

      @media (min-width: $desktop) {
        text-align: left;
        font-size: $copy-desktop;
        padding-left: 0;

        .active-messages--new & {
          text-align: center;
          padding-left: $spacing-s;
        }
      }
    }
  }

  dialog {
    @media (min-width: $desktop) {
      right: 0;
      left: auto;
      top: rem(65);
    }
  }

  .message-option-list {
    text-transform: capitalize;
    font-size: $copy-mobile-xs;
    @media (min-width: $desktop) {
      font-size: $copy-desktop-xs;
    }
    li {
      margin-top: $spacing-xs;
      display: flex;
      align-items: center;
    }

    .avatar-image {
      width: rem(20);
      height: rem(20);
      margin-right: $spacing-xs;

      &--fallback {
        font-size: $copy-mobile-xs;
      }
    }
  }

  &__cancel-btn {
    background-color: transparent;
    color: #fff;
    height: rem(44);
    border: none;
    margin-right: $spacing-s;
    font-size: $copy-mobile-s;

    @media (min-width: $desktop) {
      font-size: $copy-desktop-s;
    }
  }

  &__messages-list {
    display: flex;
    flex-direction: column;
    padding: 0 $spacing-s;
    overflow: auto;
    margin-bottom: rem(90);

    @media (min-width: $desktop) {
      padding: 0 $spacing-m;
    }
  }

  &__message {
    padding: $spacing-s;
    max-width: 90%;
    display: block;
    width: fit-content;
    border-radius: $border-radius-reg;
    position: relative;
    line-height: 1.4;
    display: flex;
    align-items: flex-end;

    &:after {
      font-family: "Font Awesome 5 Pro";
      content: "\f2ec";
      font-weight: 800;
      position: absolute;
      bottom: rem(-7);
    }

    &--user {
      background-color: $dark-green;
      margin-top: $spacing-s;
      align-self: flex-end;

      &:after {
        right: rem(-6);
        transform: rotate(20deg);
        color: $dark-green;
      }
    }

    &--recipient {
      background-color: $mid-grey;
      margin-top: rem(50);

      &:after {
        left: rem(-6);
        transform: rotate(-20deg);
        color: $mid-grey;
      }
    }

    &--double {
      margin-top: $spacing-s;
      .active-messages__message-sender {
        display: none;
      }
    }

    &--member-left,
    &--date-sent {
      margin: $spacing-m auto;
      background-color: transparent;
      font-size: $copy-mobile-xs;
      color: $lightgrey;
      border: rem(1) solid $lightgrey;
      padding: $spacing-xs;

      .active-messages__message-copy {
        margin: 0;
        line-height: 1.2;
      }

      &:after {
        display: none;
      }
    }

    &-copy {
      display: inline-block;
      margin-right: $spacing-s;
    }

    &-sender {
      font-size: $copy-mobile-xs;
      position: absolute;
      top: rem(-20);
      left: 0;
      text-transform: capitalize;

      @media (min-width: $desktop) {
        font-size: $copy-desktop-xs;
        top: rem(-25);
      }
    }

    &-time {
      font-size: $copy-mobile-xs;
      display: inline-block;
      padding-bottom: rem(3);

      @media (min-width: $desktop) {
        font-size: $copy-desktop-xs;
        padding-bottom: rem(2);
      }
    }
  }

  .active-messages__message--user {
    .active-messages__message-sender {
      display: none;
    }
  }

  .new-message-input-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $copy;
    padding: $spacing-s;
    border-top: rem(1) solid $dark-green;

    @media (min-width: $desktop) {
      position: absolute;
      border-bottom-left-radius: $border-radius-reg;
      border-bottom-right-radius: $border-radius-reg;
      padding: $spacing-s $spacing-m;
    }
  }
}

.no-messages {
  color: #fff;
  margin-top: $spacing-m;

  @media (min-width: $desktop) {
    color: $copy;
  }
}

.group-chat-start,
.delete-messages-count,
.block-contacts-count,
.delete-contacts-count {
  position: fixed;
  background-color: #fff;
  box-shadow: $box-shadow;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: $spacing-s;

  @media (min-width: $desktop) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__list {
    margin-top: $spacing-s;

    &:empty {
      margin: 0;
    }
  }

  &__list-item {
    display: inline-block;
    margin-left: rem(-10);
    vertical-align:middle;


    &:first-of-type {
      margin-left: 0;
    }

    &--fallback,
    &--group {
      background-color: $dark-green;
      color: #fff;
      overflow: hidden;
      border-radius: 100%;
      text-align: center;
      font-size: $copy-mobile-xs;
      height: rem(25);
      width: rem(25);
      border: rem(1) solid #fff;
      padding-top: rem(6);
    }

    &--fallback {
      text-transform: capitalize;
      font-weight: 600;
    }

    &--group {
      &:before {
        font-family: "Font Awesome 5 Pro";
        font-weight: 300;
        font-size: $copy-mobile-xs;
        content: "\f0c0";
      }
    }
  }

  img {
    vertical-align:bottom;
    width: rem(25);
    height: rem(25);
    overflow: hidden;
    border-radius: 100%;
    border: rem(1) solid #fff;
  }

  .cta {
    margin-top: $spacing-s;
  }
}

.group-chat-start {
  .input-container {
    margin-top: 0;
  }

  hr {
    width: 100%;
    height: rem(1);
    border: none;
    background-color: $lightgrey;
    margin: $spacing-m 0;
  }
}

.modal-dialog--login-warning{
  text-align: center;
  a.cta--primary{
    @include cta;
    @include cta--primary;
    display:inline-block;
    text-decoration: none;
    margin-top:$spacing-m;
  }
}
  
  
</style>
