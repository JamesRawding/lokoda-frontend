<template>
<div class="page-outer messages-page">
  <the-header></the-header>
  <main class="page-container">
    <div class="page-grid">
      <section v-if="messagesListVisible">
        <div class="messages-header">
          <a class="messages-header__back-link" href="javascript:history.go(-1)"><span class="sr-only"> Go Back</span></a>
          <h1>Messages</h1>
          <div class="messages-header__button-container">
            <base-text-icon-button @click="showContacts" mode="text-icon-button text-icon-button--new-message" aria-label="new message"><span class="sr-text">New</span></base-text-icon-button>
            <base-text-icon-button @click="showMessagesOptions" mode="text-icon-button text-icon-button--ellipsis" aria-label="manage messages"><span class="sr-text">Manage</span></base-text-icon-button>
            <transition>
            <base-dialog  @closeDialog="hideMessagesOptions" v-if="isMessagesOptionsDisplayed">
              <strong>Message Options</strong>
              <base-text-icon-button @click="selectMessagesToDelete" mode="text-icon-button text-icon-button--trash">Delete Chat</base-text-icon-button>
            </base-dialog>
            </transition>
          </div>
        </div>
        <!-- <search-bar @searched="searchMessages" v-if="messages.length > 0" searchId="searchMessages" ariaLabel="search messages" searchPlaceholder="Search Messages"></search-bar> -->
        <div>
          <div  v-if="messagesLoading" class="messages-loading">
            <span class="spinner"></span>Messages loading
          </div>

          <ul v-else-if="!messagesToDelete && messages" class="messages-list">
            <li 
            @click="selectedMessage(messageThread.id)" 
            @keypress.enter="selectedMessage(messageThread.id)" 
            class="messages-list__item" 
            :class="{'messages-list__item--active': messageThread.messageActive}" 
            v-for="messageThread in messages" 
            :key="messageThread.id" 
            tabindex="0" 
            role="button">

              <div v-if="messageThread.users.length == 2 && messageThreadImage(messageThread) == true" class="messages-list__item-img">
                <img :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+usersInGroup(messageThread)" alt="">
              </div>
              <div v-if="messageThread.users.length == 2 && messageThreadImage(messageThread) == false" class="messages-list__item-img messages-list__item-img messages-list__item-img--fallback">
                {{usersInGroup(messageThread)}}
              </div>
              <div v-else-if="messageThread.users.length !== 2" class="messages-list__item-img messages-list__item-img--group"></div>
              
              <div class="messages-list__item-details">
                <!-- <h2 class="messages-list__item-name"><span v-for="recipientName in messageThread.messageRecipientNames" :key="recipientName + messageID">{{recipientName}}</span></h2> -->
                <h2 class="messages-list__item-name">{{messageThread.name}}</h2>
                <!-- <p class="messages-list__item-preview">{{messageThread.latestMessage}}</p> -->
                <p class="messages-list__item-preview">{{lastMessagePreview(messageThread)}}</p>

              </div>
              <span class="messages-list__item-date">{{lastMessageDate(messageThread)}}</span>
            </li>
          </ul>
          <ul v-else class="messages-list">
            <li
            @click="messageForDeletion(messageThread)" 
            @keypress.enter="messageForDeletion(messageThread)" 
            class="messages-list__item" 
            :class="{'messages-list__item--active': messageThread.messageActive}" 
            v-for="messageThread in messages" 
            :key="messageThread.id" 
            tabindex="0" 
            role="button">
              <div v-if="messageThread.users.length == 2 && messageThreadImage(messageThread) == true" class="messages-list__item-img">
                <img :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+usersInGroup(messageThread)" alt="">
              </div>
              <div v-if="messageThread.users.length == 2 && messageThreadImage(messageThread) == false" class="messages-list__item-img messages-list__item-img messages-list__item-img--fallback">
                {{usersInGroup(messageThread)}}
              </div>
              <div v-else-if="messageThread.users.length !== 2" class="messages-list__item-img messages-list__item-img--group"></div>

              <div class="messages-list__item-details">
                <!-- <h2 class="messages-list__item-name"><span v-for="recipientName in messageThread.messageRecipientNames" :key="recipientName + messageID">{{recipientName}}</span></h2> -->
                <h2 class="messages-list__item-name">{{messageThread.name}}</h2>
                <!-- <p class="messages-list__item-preview">{{messageThread.latestMessage}}</p> -->
                <p class="messages-list__item-preview">{{messageThread.last_message}}</p>
              </div>
              <div class="group-contacts-list__item-checked-status contacts-list__item-checked-status--checked" v-if="deleteMessagesIDs.includes(messageThread)"></div>
              <div class="group-contacts-list__item-checked-status" v-else></div>
            </li>
          </ul>
        </div>
        <div v-if="!messagesLoading && messages.length === 0 && searchMessageValue === ''" class="no-messages">
          <strong>You currently have no messages.</strong>
        </div>
        <div v-else-if="!messagesLoading && messages.length === 0 && searchMessageValue !== ''" class="no-messages">
          <strong>No contacts match that search.</strong>
        </div>
      </section>

      


      <section v-else-if="contactsListVisible">
        <div class="messages-header">
          <base-icon-button @click="showMessageList" mode="icon-button icon-button--back" ariaLabel="back to messages"></base-icon-button>
          <h1>New Message</h1>
          <div class="messages-header__button-container">
            <base-text-icon-button @click="showMessageList" mode="text-icon-button text-icon-button--back">Messages</base-text-icon-button>
            <base-text-icon-button @click="showContactsOptions" mode="text-icon-button text-icon-button--ellipsis" aria-label="manage contacts"><span class="sr-text">Manage</span></base-text-icon-button>
            <transition>
            <base-dialog  @closeDialog="hideContactsOptions" v-if="isContactsOptionsDisplayed">
              <strong>Contacts Options</strong>
              <base-text-icon-button @click="selectContactsToBlock" mode="text-icon-button text-icon-button--block">Block Contacts</base-text-icon-button>
              <base-text-icon-button @click="selectContactsToDelete" mode="text-icon-button text-icon-button--trash">Delete Contacts</base-text-icon-button>
            </base-dialog>
            </transition>
          </div>
          
        </div>
        <search-bar @searched="searchContacts" v-if="contacts.length > 0" searchId="searchContacts" ariaLabel="search contacts" searchPlaceholder="Search Contacts"></search-bar>
        <div>
          <ul v-if="contactsToBlock" class="contacts-list">
            <li @click="startGroupMessage" class="contacts-list__item contacts-list__item--new-group">New Group</li>
            <li
            @click="contactForBlocking(contact)" 
            @keypress.enter="contactForBlocking(contact)"
            class="contacts-list__item" 
            v-for="contact in alphabetisedContacts" 
            :key="contact.id" 
            tabindex="0" 
            role="button">
              <div v-if="contact.avatar_url" class="contacts-list__item-img">
                <img   :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+contact.avatar_url" alt="">
              </div>
              <div v-else class="contacts-list__item-img contacts-list__item-img--fallback">
                  {{contact.name.slice(0,1)}}
              </div>
              
              <div class="messages-list__item-details">
                <h2 class="messages-list__item-name">{{contact.name}}</h2>
              </div>
              <div class="group-contacts-list__item-checked-status contacts-list__item-checked-status--checked" v-if="blockContactsIDs.includes(contact)"></div>
              <div class="group-contacts-list__item-checked-status" v-else></div>
            </li>
          </ul>
          <ul v-else-if="contactsToDelete" class="contacts-list">
            <li @click="startGroupMessage" class="contacts-list__item contacts-list__item--new-group">New Group</li>
            <li
            @click="contactForDeletion(contact)" 
            @keypress.enter="contactForDeletion(contact)"
            class="contacts-list__item" 
            v-for="contact in alphabetisedContacts" 
            :key="contact.id" 
            tabindex="0" 
            role="button">
              <div v-if="contact.avatar_url" class="contacts-list__item-img">
                <img   :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+contact.avatar_url" alt="">
              </div>
              <div v-else class="contacts-list__item-img contacts-list__item-img--fallback">
                  {{contact.name.slice(0,1)}}
              </div>
              <div class="messages-list__item-details">
                <h2 class="messages-list__item-name">{{contact.name}}</h2>
              </div>
              <div class="group-contacts-list__item-checked-status contacts-list__item-checked-status--checked" v-if="deleteContactsIDs.includes(contact)"></div>
              <div class="group-contacts-list__item-checked-status" v-else></div>
            </li>
          </ul>
          <!-- <ul v-else class="contacts-list">
            <li @click="startGroupMessage" class="contacts-list__item contacts-list__item--new-group">New Group</li>
            <li
            @click="startChat(contact.contactID)"
            @keypress.enter="startChat(contact.contactID)" 
            class="contacts-list__item" 
            v-for="contact in alphabetisedContacts" 
            :key="contact.contactID" 
            tabindex="0" 
            role="button">
              <div class="contacts-list__item-img">
                <img src="../assets/images/dummy-profile-pic.jpg" :alt="contact.contactName + ' profile image'">
              </div>
              <div class="messages-list__item-details">
                <h2 class="messages-list__item-name">{{contact.contactName}}</h2>
              </div>
            </li>
          </ul> -->
          <ul v-else class="contacts-list">
            <li @click="startGroupMessage" class="contacts-list__item contacts-list__item--new-group">New Group</li>
            <li
            @click="startChat(contact.id)"
            @keypress.enter="startChat(contact.id)" 
            class="contacts-list__item" 
            v-for="contact in alphabetisedContacts" 
            :key="contact.id" 
            tabindex="0" 
            role="button">
              <div v-if="contact.avatar_url" class="contacts-list__item-img">
                <img   :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+contact.avatar_url" alt="">
              </div>
              <div v-else class="contacts-list__item-img contacts-list__item-img--fallback">
                  {{contact.name.slice(0,1)}}
              </div>
              <div class="messages-list__item-details">
                <h2 class="messages-list__item-name">{{contact.name}}</h2>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="alphabetisedContacts.length === 0 && searchContactValue === ''" class="no-messages">
          <strong>You currently have no contacts.</strong>
        </div>
        <div v-else-if="alphabetisedContacts.length === 0 && searchContactValue !== ''" class="no-messages">
          <strong>No contacts match that search.</strong>
        </div>
      </section>

      

      <section v-else-if="groupContactsListVisible">
        <div class="messages-header">
          <base-icon-button @click="showContacts" mode="icon-button icon-button--back" ariaLabel="back to contacts"></base-icon-button>
          <h1>New Group</h1>
          <div class="messages-header__button-container">
            <base-text-icon-button @click="showContacts" mode="text-icon-button text-icon-button--back">Contacts</base-text-icon-button>
          </div>
        </div>
        <search-bar @searched="searchContacts" v-if="contacts.length > 0" searchId="searchContacts" ariaLabel="search contacts" searchPlaceholder="Search Contacts"></search-bar>
        <div>
          <ul class="group-contacts-list">
            <li
            @click="addGroupRecipient(contact.id)" 
            class="group-contacts-list__item"
            v-for="contact in alphabetisedContacts" 
            :key="contact.id" 
            tabindex="0" 
            role="checkbox"
            :aria-checked="groupChatContactsIDs.includes(contact.id) ? 'true' : 'false'"
            :aria-labelledby="contact.id+'-checkbox'">
              <div v-if="contact.avatar_url" class="contacts-list__item-img">
                <img :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+contact.avatar_url" alt="">
              </div>
              <div v-else class="contacts-list__item-img contacts-list__item-img--fallback">
                  {{contact.name.slice(0,1)}}
              </div>
              <div class="group-contacts-list__item-details">
                <span class="sr-only" :id="contact.id+'-checkbox'"> Add {{contact.name}} to group chat </span>
                <h2 class="group-contacts-list__item-name">{{contact.name}}</h2>
                <div class="group-contacts-list__item-checked-status contacts-list__item-checked-status--checked" v-if="groupChatContactsIDs.includes(contact.id)"></div>
                <div class="group-contacts-list__item-checked-status" v-else></div>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="alphabetisedContacts.length === 0 && searchContactValue === ''" class="no-messages">
          <strong>You currently have no contacts.</strong>
        </div>
        <div v-else-if="alphabetisedContacts.length === 0 && searchContactValue !== ''" class="no-messages">
          <strong>No contacts match that search.</strong>
        </div>
      </section>

      


      <div class="delete-messages-count" v-if="messagesToDelete">
        <span>{{deleteMessagesCount}} message<span v-if="deleteMessagesIDs.length > 1">s</span> selected</span>
        <ul class="delete-messages-count__list">
          <li class="delete-messages-count__list-item" v-for="message in deleteMessagesIDs" :key="message.messageID">
            <!-- <div v-if="message.users.length === 2 && ">One to one</div>
            <div v-else>Group</div> -->
            <!-- {{message.users}} -->
            <div v-if="message.users.length === 2">
              <div v-for="user in message.users" :key="user.id">
              <!-- <div v-if="user.id === !thisUserID && user.avatar_url !== null">{{user.avatar_url}}</div>
              <div v-else>No image</div> -->
              <!-- <div v-else>{{user.name}}</div> -->

              <!-- <div v-if="user.id !== thisUserID && user.avatar_url">Has an image</div>
              <div v-else>no image</div> -->
              <div class="delete-messages-count__list-item--fallback" v-if="user.id !== thisUserID && user.avatar_url == null">{{user.name.slice(0,1)}}</div>
              <img v-else-if="user.id !== thisUserID && user.avatar_url !== null" :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+user.avatar_url" alt="">

              <!-- <div v-else>Me</div> -->
              <!-- <span>Group user ID{{user.id}}</span>
              <span>This user Id == {{thisUserID}}</span> -->

              <!-- {{user.avatar_url}} -->
              </div>
            </div>
            <div class="delete-messages-count__list-item--group" v-else></div>
            
            <!-- <img src="../assets/images/dummy-profile-pic.jpg" alt=""> -->
          </li>
        </ul>
        <base-button v-if="deleteMessagesIDs.length >= 1" @click="deleteSelectedMessages"  role="button" mode="cta cta--primary">Delete Message<span v-if="deleteMessagesIDs.length > 1">s</span></base-button>
      </div>

      <div class="block-contacts-count" v-if="contactsToBlock">
        <span>{{blockContactsCount}} contact<span v-if="blockContactsIDs.length > 1">s</span> selected</span>
        <ul class="block-contacts-count__list">
          <li class="block-contacts-count__list-item" v-for="contact in blockContactsIDs" :key="contact.id">
            <img v-if="contact.avatar_url"  :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+contact.avatar_url" alt="">
              <div v-else class="group-chat-start__list-item--fallback">
                  {{contact.name.slice(0,1)}}
              </div>
          </li>
        </ul>
        <base-button @click="blockSelectedContacts" v-if="blockContactsIDs.length >= 1"   role="button" mode="cta cta--primary">Block Contact<span v-if="blockContactsIDs.length > 1">s</span></base-button>
      </div>

      <div class="delete-contacts-count" v-if="contactsToDelete">
        <span>{{deleteContactsCount}} contact<span v-if="deleteContactsIDs.length > 1">s</span> selected</span>
        <ul class="delete-contacts-count__list">
          <li class="delete-contacts-count__list-item" v-for="contact in deleteContactsIDs" :key="contact.id">
            <img v-if="contact.avatar_url"  :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+contact.avatar_url" alt="">
              <div v-else class="group-chat-start__list-item--fallback">
                  {{contact.name.slice(0,1)}}
              </div>
          </li>
        </ul>
        <base-button @click="deleteSelectedContacts" v-if="deleteContactsIDs.length >= 1"   role="button" mode="cta cta--primary">Delete Contact<span v-if="deleteContactsIDs.length > 1">s</span></base-button>
      </div>

      <!-- <div class="group-chat-start" v-if="groupChatContacts.length > 0">
        <base-input
          inputId="groupName"
          inputType="text"
          v-model="groupChatName"
          :isRequired="true"
        >
          <template #label>Group Subject</template>
        </base-input>
        <base-button :disabled="!groupChatName" @click="startGroupChat(groupChatContactsIDs)"  role="button" mode="cta cta--primary">Start Group Chat</base-button>
        <hr>
        <span v-if="groupChatContacts.length === 1">{{groupChatCount}} contact selected</span>
        <span v-else>{{groupChatCount}} contacts selected</span>
        <ul class="group-chat-start__list">
          <li class="group-chat-start__list-item" v-for="contact in groupChatContacts" :key="contact.contactID">
            <img src="../assets/images/dummy-profile-pic.jpg" :alt="contact.contactName + ' profile image'">
          </li>
        </ul>
      </div> -->
      <div class="group-chat-start" v-if="groupChatContacts.length > 0">
        <base-input
          inputId="groupName"
          inputType="text"
          v-model="groupChatName"
          :isRequired="true"
        >
          <template #label>Group Subject</template>
        </base-input>
        <base-button :disabled="!groupChatName" @click="startChat(groupChatContactsIDs)"  role="button" mode="cta cta--primary">Start Group Chat</base-button>
        <hr>
        <span v-if="groupChatContacts.length === 1">{{groupChatCount}} contact selected</span>
        <span v-else>{{groupChatCount}} contacts selected</span>
        <ul class="group-chat-start__list">
          <li class="group-chat-start__list-item" v-for="contact in groupChatContacts" :key="contact.id">
              <img v-if="contact.avatar_url"  :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+contact.avatar_url" alt="">
              <div v-else class="group-chat-start__list-item--fallback">
                  {{contact.name.slice(0,1)}}
              </div>
          </li>
        </ul>
      </div>

      <!-- <section v-if="newGroupMessage" class="active-messages active-messages--new">
        <div class="active-messages__header">
          <base-button @click="cancelGroupMessage" buttonType="button" mode="active-messages__cancel-btn">Cancel <span class="sr-only">new message</span></base-button>
          <h3 class="messages-list__item-name"><span v-for="recipientName in messageRecipientNames" :key="recipientName + messageID">{{recipientName}}</span></h3>
          <h3 class="messages-list__item-name">Group{{chatName}}</h3>

        </div>
        <div class="new-message-input-container">
          <new-message-input @sendNewMessage="submitNewMessage" ariaLabel="Send new message" inputId="newGroupMessage"></new-message-input>
        </div>
      </section> -->

      
      <section v-if="newMessage" class="active-messages active-messages--new">
        <div class="active-messages__header">
          <base-button @click="cancelMessage" buttonType="button" mode="active-messages__cancel-btn">Cancel <span class="sr-only">new message</span></base-button>
          <!-- <h3 class="messages-list__item-name">{{messageRecipientNames}}</h3> -->
          <h3 class="messages-list__item-name">{{chatName}}</h3>
          

        </div>
        <ul class="active-messages__messages-list">
          <li 
            v-for="message in selectedMessagesArray.slice().reverse()" :key="message.id" 
            :class="['active-messages__message', (thisUserID === message.user_id ? 'active-messages__message--user' : 'active-messages__message--recipient'),(message.doubleMessage ? 'active-messages__message--double' : ''),(messages.messageSenderID === 'memberLeftGroup' ? 'active-messages__message--member-left' : ''),(messages.messageSenderID === 'dateSent' ? 'active-messages__message--date-sent' : '')]">
            <!-- <span class="active-messages__message-sender">{{message.user_id}}</span> -->
            <span class="active-messages__message-sender">{{ nameMatch(message) }}</span>
            <span class="active-messages__message-copy">{{message.message}}</span>
            <span class="active-messages__message-time">{{message.created_time}}</span>
          </li>
        </ul>
        <div class="new-message-input-container">
          <new-message-input @sendNewMessage="submitStartChat" ariaLabel="Send new message" inputId="newMessage"></new-message-input>
        </div>
      </section>


      <section v-if="messagesSelected" class="active-messages">
        <div class="active-messages__header">
          <base-icon-button @click="closeMessage" buttonType="button" mode="icon-button icon-button--back" ariaLabel="close message"></base-icon-button>
          <!-- <h3 class="messages-list__item-name"><span v-for="recipientName in messageRecipientNames" :key="recipientName + messageID">{{recipientName}}</span></h3> -->
          <h3 class="messages-list__item-name">{{chatName}}</h3>

          <base-icon-button @click="manageActiveMessage" buttonType="button" mode="icon-button icon-button--ellipsis" ariaLabel="more options"></base-icon-button>
          
        </div>
        <transition>
        <base-dialog  @closeDialog="hideActiveMessageOptions" v-if="isActiveMessageOptionsDisplayed">
          <strong>Message Options</strong>
          <base-text-icon-button v-if="selectedMessagesUsers.length > 2" @click="leaveGroup" mode="text-icon-button text-icon-button--logout">Leave Group</base-text-icon-button>
          <base-text-icon-button v-else @click="blockSender" mode="text-icon-button text-icon-button--block">Block Sender</base-text-icon-button>
          <base-text-icon-button @click="deleteActiveMessage" mode="text-icon-button text-icon-button--trash">Delete Chat</base-text-icon-button>
          <div v-if="selectedMessagesUsers.length > 2">
            <hr>
            <strong>Group Members</strong>
            <ul class="message-option-list">
              <li v-for="user in selectedMessagesUsers" :key="user.id">
                <img v-if="user.avatar_url" class="avatar-image" :src="'https://res.cloudinary.com/dgddraffq/image/upload/w_60,h_60,c_limit,f_auto,q_auto:best,c_fill,g_faces/'+user.avatar_url" :alt="user.name + ' avatar image'">
                <div v-else class="avatar-image avatar-image--fallback">
                  {{user.name.slice(0,1)}}
                </div>
                {{user.name}}
              </li>
            </ul>
          </div>
          
        </base-dialog>
        </transition>
        <ul class="active-messages__messages-list">
          <!-- <li 
            v-for="messages in activeMessages" :key="messages.messageTime + messages.messageDate" 
            :class="['active-messages__message', (thisUserID === messages.user_id ? 'active-messages__message--user' : 'active-messages__message--recipient'),(messages.doubleMessage ? 'active-messages__message--double' : ''),(messages.messageSenderID === 'memberLeftGroup' ? 'active-messages__message--member-left' : ''),(messages.messageSenderID === 'dateSent' ? 'active-messages__message--date-sent' : '')]">
            <span class="active-messages__message-sender">{{messages.messageSenderName}}</span>
            <span class="active-messages__message-copy">{{messages.message}}</span>
            <span class="active-messages__message-time">{{messages.messageTime}}</span>
          </li> -->
          <li 
            v-for="message in selectedMessagesArray.slice().reverse()" :key="message.id" 
            :class="['active-messages__message', (thisUserID === message.user_id ? 'active-messages__message--user' : 'active-messages__message--recipient'),(message.doubleMessage ? 'active-messages__message--double' : ''),(messages.messageSenderID === 'memberLeftGroup' ? 'active-messages__message--member-left' : ''),(messages.messageSenderID === 'dateSent' ? 'active-messages__message--date-sent' : '')]">
            <!-- <span class="active-messages__message-sender">{{message.user_id}}</span> -->
            <span class="active-messages__message-sender">{{ nameMatch(message) }}</span>
            <span class="active-messages__message-copy">{{message.message}}</span>
            <span class="active-messages__message-time">{{message.created_time}}</span>
          </li>
        </ul>
        <div class="new-message-input-container">
          <new-message-input @sendNewMessage="submitNewMessage" ariaLabel="Send new message" inputId="newMessage"></new-message-input>
        </div>
      </section>
    </div>
    
  </main>
  <the-footer></the-footer>
  </div>
</template>

<script>
import axios from "axios";
import TheHeader from '../components/layouts/TheHeader.vue';
import TheFooter from '../components/layouts/TheFooter.vue';
import BaseButton from '../components/UI/BaseButton.vue';
import BaseTextIconButton from '../components/UI/BaseTextIconButton.vue';
import BaseIconButton from '../components/UI/BaseIconButton.vue';
import NewMessageInput from '../components/UI/NewMessageInput.vue';
import SearchBar from '../components/UI/SearchBar.vue';
import BaseInput from '../components/UI/BaseInput.vue';
import BaseDialog from '../components/UI/BaseDialog.vue';

export default {
  components:{
    TheHeader,
    TheFooter,
    BaseButton,
    BaseTextIconButton,
    BaseIconButton,
    SearchBar,
    BaseInput,
    NewMessageInput,
    BaseDialog
  },
  props:['profileID'],
  data(){
    return{ 
      searchMessageValue: '',
      searchContactValue: '',
      messagesLoading: true,
      messagesListVisible: true,
      messagesSelected: false,
      newMessage: false,
      thisUserID: this.$store.state.userID,
      thisUserName: 'Down To Folk',
      thisUserNewMessage: '',
      thisUserNewMessageDate: '',
      thisUserNewMessageTime: '',
      messageID: '',
      messageRecipientNames: [],
      messageRecipientIDs: [],
      chatName: '',
      newChatID: '',
      selectedMessagesArray: [],
      selectedMessagesUsers:[],
      //selectedMessageLatestSender: '',
      contactsListVisible: false,
      groupContactsListVisible: false,
      groupChatContacts:[],
      groupChatContactsIDs:[],
      //the above is very hacky
      groupChatCount: 0,
      groupChatName: "",
      //newGroupMessage: false,
      isMessagesOptionsDisplayed: false,
      messagesToDelete: false,
      deleteMessagesIDs: [],
      deleteMessagesCount: 0,
      isContactsOptionsDisplayed: false,
      contactsToBlock: false,
      blockContactsIDs: [],
      blockContactsCount: 0,
      contactsToDelete: false,
      deleteContactsIDs: [],
      deleteContactsCount: 0,
      isActiveMessageOptionsDisplayed: false,
      contacts:[],
      messages:[],
    }
  },
  methods:{
    cancelActiveMessage(){
      for (let i = 0; i < this.messages.length; i++) {
        this.messages[i].messageActive = false;
      }
      this.messageRecipientNames = [];
      
    },
    closeMessage(){
      this.messagesSelected = false;
      this.contactsListVisible = false;
      this.messagesListVisible = true;
      this.cancelActiveMessage();
    },
    selectedMessage(val){
      //console.log(val)
      this.cancelActiveMessage();
      const chosenMessage = this.messages.find(message => message.id === val);
      chosenMessage.messageActive = true;
      // if(chosenMessage.messageRead == false){
      //   chosenMessage.messageRead = true;
      //   this.$store.commit('messagesUnreadDecrement');
      // }
  
      //this.selectedMessageLatestSender
      this.messagesSelected = true;
      this.messagesListVisible = true;
      this.groupContactsListVisible = false;
      this.newMessage = false;
      // this.messageRecipientNames = chosenMessage.messageRecipientNames;
      this.chatName = chosenMessage.name;
      // this.messageRecipientIDs = chosenMessage.messageRecipientIDs;
      axios.get("api/get_group/"+chosenMessage.id).then((res) => {
        this.selectedMessagesArray = res.data.messages;
        this.selectedMessagesUsers = res.data.users;
        //console.log(res.data.messages)
        //console.log(res.data.messages[0].user)
        //console.log(res.data)

        if(this.selectedMessagesArray && this.selectedMessagesArray.length){
          this.selectedMessagesArray.map(function(value, index, elements) {
          let next = elements[index+1];

            if(elements.length - 1 === index){
              // do nothing
            }else if(value.user_id === next.user_id){
             value.doubleMessage = true
           } 
        });
        }
      });
      
    },
    nameMatch(val){
      let userName = '';
      // console.log(val.user_id);
      // console.log(this.selectedMessagesUsers);

      for (let i = 0; i < this.selectedMessagesUsers.length; i++) {
        if(val.user_id == this.selectedMessagesUsers[i].id){
          userName = this.selectedMessagesUsers[i].name
        }
      }

      return userName;
    },

     usersInGroup(val){
      for (let i = 0; i < val.users.length; i++) {
        if(val.users[i].id !== this.$store.state.userID){
          if(val.users[i].avatar_url == null){       
            return val.users[i].name.slice(0,1)
          }else{
            // console.log('image is here')
            // console.log(val.users[i].avatar_url)
            return val.users[i].avatar_url;
          }  
        }
      }
    },

    messageThreadImage(val){
      // console.log('here')
         //console.log(val.users);

        //const user = val.users.find(user => user.id !== this.thisUserID )

        for (let i = 0; i < val.users.length; i++) {
          const userID = val.users[i].id;
          if(userID !== this.thisUserID){
            const user = val.users[i];
            //console.log(user)

            if(user.avatar_url){
              //console.log('has image')
              return true;
            }else{
             //console.log('NO image') 
             return false;
            }
          }
          
        }

        // if(user.avatar_url){
        //   console.log('has image')
        // }else{
        //   ('no image')
        // }
        //console.log(user)

        //return user;


    },

    lastMessagePreview(val){
      for (let i = 0; i < val.messages.length; i++) {
        return val.messages[i].message
      }

    },

    lastMessageDate(val){
      for (let i = 0; i < val.messages.length; i++) {
        return val.messages[i].created_date
        //this needs to be date and month!
      }
    },

    submitStartChat(val){
      
       axios.post("/api/create_group",{
          name: this.$store.state.newContact.contactName,
          users: [this.$store.state.newContact.contactID]
        }).then((res) => {
          this.newChatID = res.data.id;
          //console.log(this.newChatID)
          axios.post("api/add_message",{
          group_id: this.newChatID,
          message: val,
        }).then(() => {

          axios.get("api/get_groups").then((res) => {
          
          this.messages = res.data;
          this.newMessage = false;
          this.selectedMessage(this.newChatID);
          this.newChatID = '';
          
        });
        });
          
          
        })
      

      
    },

    submitNewMessage(val){
      //const currentMessageThread = this.messages.find(message => message.messageActive == true).recipientMessages;
      //const currentMessageThread = this.selectedMessagesArray   
      
      const latestMessageInfo = this.messages.find(message => message.messageActive == true);
      const currentMessageID = this.messages.find(message => message.messageActive == true).id;

      //console.log(currentMessageThread)
      // console.log(latestMessageInfo)
      // console.log(currentMessageID)
      
      const nth = function(d) {
          if (d > 3 && d < 21) return 'th';
          switch (d % 10) {
              case 1:  return "st";
              case 2:  return "nd";
              case 3:  return "rd";
              default: return "th";
          }
      }
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
      const currentDay = currentDate.getDay();
      const currentDayFormatted = currentDay+nth(currentDay);
      //const currentTime = currentDate.getHours() + ":" + (currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes();
      const currentDayMonth = currentDayFormatted + " " + currentMonth;
      this.thisUserNewMessage = val;



        // for (let i = 0; i < currentMessageThread.length; i++) {
        //   var length = currentMessageThread.length
        //   if(currentMessageThread[i].user_id == currentMessageThread[(i+length-1)%length].user_id){
        //     currentMessageThread[i].doubleMessage = true;

        //     console.log('double')
        //   }
        // }
  


      // if(currentMessageThread.find(message => message.messageSenderID === 'dateSent') && currentMessageThread.find(message => message.messageDate === currentDayMonth)){
      //   //Nothing here as targeting !== dateSent will return all other IDs
      // }
      // else{
      //   currentMessageThread.unshift({
      //     id: 'dateSent',
      //     created_at: '',
      //     messageDate: currentDayMonth,
      //     message: currentDayMonth
      //   });
      // }

      


      if(this.thisUserNewMessage !== '' && this.thisUserNewMessage !== ' '){
        // currentMessageThread.push({ 
        //   messageSenderID: this.thisUserID,
        //   messageSenderName: this.thisUserName,
        //   messageTime: currentTime,
        //   messageDate: currentDayMonth,
        //   message: this.thisUserNewMessage,
        // });
        
        latestMessageInfo.latestMessage = this.thisUserNewMessage;
        latestMessageInfo.latestMessageDate = currentDayMonth;
        latestMessageInfo.latestMessageTimestamp = new Date().getTime();
        this.newMessage = false;
        //this.newGroupMessage = false;
        //this.selectedMessage(latestMessageInfo.id)
        // console.log(latestMessageInfo);
        //console.log(currentMessageID);
        // console.log(this.thisUserNewMessage)
        axios.post("api/add_message",{
          group_id: currentMessageID,
          message: this.thisUserNewMessage,
        }).then(() => {
          //console.log(res)
          
          // currentMessageThread.unshift({
          //   //id: this.thisUserID,
          //   user_id: this.thisUserID,
          //   created_at: currentTime,
          //   messageDate: currentDayMonth,
          //   message: this.thisUserNewMessage,
          // });
          axios.get("api/get_groups").then((res) => {
          
          this.messages = res.data;
          this.selectedMessage(currentMessageID);
          
          
        });
        });
      }
      
    },
    showContacts(){  
      this.hideCounts();
      this.groupChatContacts = [];
      this.groupChatContactsIDs = [];
      this.groupChatCount = 0;
      this.groupChatName = '';
      this.messageID = '';
      this.messageRecipientNames = [],
      this.messageRecipientIDs = [],
      this.newMessage = false;
      this.cancelActiveMessage();
      this.contactsListVisible = true;
      this.groupContactsListVisible = false;
      this.messagesListVisible = false;
      this.messagesSelected = false;

      // for (let i = 0; i < this.messages.length; i++) {
      //   if(this.messages[i].recipientMessages.length <= 0){
      //     this.messages.shift();
      //   }
      // }
      
    },
    showMessageList(){
      this.contactsListVisible = false;
      this.messagesListVisible = true;
      this.hideCounts();
      
    },
    startGroupMessage(){
      this.contactsListVisible = false;
      this.groupContactsListVisible = true;
      this.messagesListVisible = false;
    },
    // startChat(val){
    //   this.contactsListVisible = false;
    //   this.messagesListVisible = true;
    //   if(this.messages.find(message => message.messageID === val)){
    //     this.selectedMessage(val)
    //   }else{
    //     this.newMessage = true;
    //     const chosenContact = this.contacts.find(contact => contact.contactID === val);
    //     this.messageRecipientNames = chosenContact.contactName;
    //     this.messageID = chosenContact.contactID
    //     this.messages.unshift({
    //       messageID: chosenContact.contactID,
    //       messageRecipientNames: [chosenContact.contactName],
    //       recipientMessages:[],
    //       messageActive: true,
    //       messageRecipientIDs: [this.thisUserID,chosenContact.contactID]

    //     });

        
    //   }
    // },
    // startGroupChat(val){
    //   console.log(val)
    //   val.sort((a, b) => {
    //     if (a < b)
    //         return -1;
    //     if (a > b)
    //         return 1;
    //     return 0;
    //   });
    //   val = val.join('-')
    //   if(this.messages.find(message => message.id === val)){
    //     this.selectedMessage(val);
    //     this.groupChatContacts = [];
    //     this.groupChatContactsIDs = [];
    //     this.groupChatCount = 0;
    //     this.groupChatName = '';
    //   }else{
    //     const groupContacts = [];
    //     const groupContactsIDs = [];
    //     for (let i = 0; i < this.groupChatContacts.length; i++) {
    //       groupContacts.push(''+this.groupChatContacts[i].contactName+'')
    //     }
    //     for (let i = 0; i < this.groupChatContacts.length; i++) {
    //       groupContactsIDs.push(''+this.groupChatContacts[i].contactID+'')
    //     }

    //     groupContactsIDs.sort((a, b) => {
    //       if (a < b)
    //           return -1;
    //       if (a > b)
    //           return 1;
    //       return 0;
    //     }); 
        
    //     const groupRecipientIDs = groupContactsIDs;
    //     groupRecipientIDs.push(this.thisUserID);
    //     this.groupContactsListVisible = false;
    //     this.newGroupMessage = true;
    //     this.messagesListVisible = true;
    //     this.messageRecipientNames = groupContacts;
    //     this.groupChatContacts = [];

    //     this.messages.unshift({
    //       messageID: groupContactsIDs.join('-'),
    //       messageRecipientNames: groupContacts,
    //       recipientMessages:[],
    //       messageActive: true,
    //       messageRecipientIDs: groupRecipientIDs
    //     });

    //     axios.post("api/create_group",{
    //       name: this.groupChatName,
    //       users:groupContactsIDs
    //     }).then((res) => {
    //       console.log(res)
    //       this.groupChatName = ""
    //     });
    //   }
    // },
    startChat(val){
      //console.log(val)
      if(typeof val === "string"){
        this.contactsListVisible = false;
        this.messagesListVisible = true;
        // console.log(this.messages)
        // console.log(val)
        
        
        for (let i = 0; i < this.messages.length; i++) {
        let groupUsers = this.messages[i];
        let groupUsersIDs = this.messages[i].users

        //console.log(groupUsersIDs)

          if (groupUsers.users.length === 2 && groupUsersIDs.find(x => x.id === val)) {
             //console.log('one 2 one')
            // console.log(groupUsers.id)
            this.newMessage = false;
            this.selectedMessage(groupUsers.id)
           // break;
            return true;
            
          }
          // else{
          //   // console.log('group')
          //   // this.newMessage = true;
          //   // const chosenContact = this.contacts.find(contact => contact.id === val);
          //   // //console.log(chosenContact)
          //   // this.messageRecipientNames = chosenContact.name;
          //   // this.chatName = chosenContact.name;

          //   // axios.post("/api/create_group",{
          //   //   name: chosenContact.name,
          //   //   users:[chosenContact.id]
          //   // }).then((res) => {
          //   //   //console.log('here')
          //   //   this.newChatID = res.data.id;
          //   //   axios.get("api/get_groups").then((res) => {
              
          //   //   this.messages = res.data;
          //   // });
              
          //   // })
                   
          // }
          
        }

        //console.log('group')
            this.newMessage = true;
            const chosenContact = this.contacts.find(contact => contact.id === val);
            //console.log(chosenContact)
            this.messageRecipientNames = chosenContact.name;
            this.chatName = chosenContact.name;

            axios.post("/api/create_group",{
              name: chosenContact.name,
              users:[chosenContact.id]
            }).then((res) => {
              // console.log('here')
              // console.log(res.data)
              this.newChatID = res.data.id;
              //console.log(this.newChatID)
              axios.get("api/get_groups").then((res) => {
              
              this.messages = res.data;
            });
              
            })

        return true;
        
        
        // if(this.messages.find(message => message.id === val)){
        //   console.log('samesies')
        //   //this.selectedMessage(val)
        // }else{
        //   console.log('not samesies')
        //   this.newMessage = true;
        //   const chosenContact = this.contacts.find(contact => contact.id === val);
        //   //console.log(chosenContact)
        //   this.messageRecipientNames = chosenContact.name;
        //   this.chatName = chosenContact.name;
        //   //this.messageID = chosenContact.contactID
        //   // this.messages.unshift({
        //   //   //messageID: chosenContact.contactID,
        //   //   messageRecipientNames: [chosenContact.name],
        //   //   recipientMessages:[],
        //   //   messageActive: true,
        //   //   messageRecipientIDs: [this.thisUserID,chosenContact.id]

        //   // });
          
        // //   axios.post("/api/create_group",{
        // //   name: chosenContact.name,
        // //   users:[chosenContact.id]
        // // }).then((res) => {
        // //   //console.log('here')
        // //   this.newChatID = res.data.id;

        // //   axios.get("api/get_groups").then((res) => {
          
        // //   this.messages = res.data;
        // // });
          
        // // });

        

          
        // }
      }else{
        // console.log('its a group')
        // console.log(val)
      //   val.sort((a, b) => {
      //   if (a < b)
      //       return -1;
      //   if (a > b)
      //       return 1;
      //   return 0;
      // });
      // val = val.join('-')
      if(this.messages.find(message => message.id === val)){
        //this.selectedMessage(val);
        this.groupChatContacts = [];
        this.groupChatContactsIDs = [];
        this.groupChatCount = 0;
        this.groupChatName = '';
      }else{
        const groupContacts = [];
        const groupContactsIDs = [];
        for (let i = 0; i < this.groupChatContacts.length; i++) {
          groupContacts.push(''+this.groupChatContacts[i].name+'')
        }
        for (let i = 0; i < this.groupChatContacts.length; i++) {
          groupContactsIDs.push(''+this.groupChatContacts[i].id+'')
        }

        // groupContactsIDs.sort((a, b) => {
        //   if (a < b)
        //       return -1;
        //   if (a > b)
        //       return 1;
        //   return 0;
        // }); 
        
        const groupRecipientIDs = groupContactsIDs;
        groupRecipientIDs.push(this.thisUserID);
        this.groupContactsListVisible = false;
        //this.newGroupMessage = true;
        this.newMessage = true;
        this.messagesListVisible = true;
        this.messageRecipientNames = groupContacts;
        this.groupChatContacts = [];
        this.chatName = this.groupChatName;

        // this.messages.unshift({
        //   messageID: groupContactsIDs.join('-'),
        //   //messageRecipientNames: groupContacts,
        //   recipientMessages:[],
        //   messageActive: true,
        //   //messageRecipientIDs: groupRecipientIDs
        // });

        // axios.post("api/create_group",{
        //   name: this.groupChatName,
        //   users:groupContactsIDs
        // }).then((res) => {
        //   console.log(res)
        // });
      }
      }
      
    },
    addGroupRecipient(val){
      //console.log(val)
      const groupArray = this.groupChatContacts;
      const groupIDsArray = this.groupChatContactsIDs;
      //the above is a little hacky
      const contact = this.contacts.find(contact => contact.id === val);

      // console.log(groupArray)
      //  console.log(groupIDsArray)


      if(!groupArray.includes(contact)){          
          groupArray.push(contact);
          groupIDsArray.push(val);
          this.groupChatCount += 1;
      }else{
          groupArray.splice(groupArray.indexOf(contact), 1);
          groupIDsArray.splice(groupIDsArray.indexOf(val), 1);
          this.groupChatCount -= 1;
      }    
    },
    cancelMessage(){
      this.messages.shift();
      this.newMessage = false;
      this.cancelActiveMessage();

      axios.get("api/delete_group/"+this.newChatID).then((res) => {
        this.messages = res.data.messages;

        axios.get("api/get_groups").then((res) => {
          //console.log(res)
          this.messages = res.data;
          
        });
      });


      this.chatName = '';



      this.groupContactsListVisible = true;
      this.groupChatContacts = [];
      this.groupChatContactsIDs = [];
      this.groupChatCount = 0;
      this.groupChatName = '';
    },
    // cancelGroupMessage(){
    //   this.messages.shift();
    //   this.newGroupMessage = false;
    //   this.groupContactsListVisible = true;
    //   this.cancelActiveMessage();
    //   this.groupChatContacts = [];
    //   this.groupChatContactsIDs = [];
    //   this.groupChatCount = 0;
    //   this.groupChatName = '';
    // },
    showMessagesOptions(){
      this.isMessagesOptionsDisplayed = true;
    },
    hideMessagesOptions(){
      this.isMessagesOptionsDisplayed = false;
    },

    selectMessagesToDelete(){
      this.closeMessage();
      this.messagesToDelete = true;
      this.hideMessagesOptions();
    },
    messageForDeletion(val){
      //console.log(val)
      const deleteMessagesArray = this.deleteMessagesIDs;
      if(!deleteMessagesArray.includes(val)){          
          deleteMessagesArray.push(val);
          this.deleteMessagesCount += 1;
      }else{
        deleteMessagesArray.splice(deleteMessagesArray.indexOf(val), 1);
        this.deleteMessagesCount -= 1;
      }
    },

    deleteSelectedMessages(){
      const messageArray = this.messages;
      this.messagesToDelete = false;
      this.deleteMessagesCount = 0;

      for (let i = 0; i < this.deleteMessagesIDs.length; i++) {
        let selectedMessage = this.deleteMessagesIDs[i]
        messageArray.splice(messageArray.findIndex(v => v.messageID === selectedMessage), 1);
      }
      this.deleteMessagesIDs = [];
    },

    hideCounts(){
      this.contactsToBlock = false;
      this.blockContactsCount = 0;
      this.blockContactsIDs = [];
      this.contactsToDelete = false;
      this.deleteContactsCount = 0;
      this.deleteContactsIDs = [];
      this.messagesToDelete = false;
      this.deleteMessagesCount = 0;
      this.deleteMessagesIDs = [];
    },

    showContactsOptions(){
      this.isContactsOptionsDisplayed = true;
      this.contactsToBlock = false;
      this.hideCounts();
    },

    hideContactsOptions(){
      this.isContactsOptionsDisplayed = false;
    },

    selectContactsToBlock(){
      this.isContactsOptionsDisplayed = false;
      this.contactsToBlock = true;
    },

    contactForBlocking(val){
      //console.log(val)
      const blockContactsArray = this.blockContactsIDs;
      if(!blockContactsArray.includes(val)){          
          blockContactsArray.push(val);
          this.blockContactsCount += 1;
      }else{
        blockContactsArray.splice(blockContactsArray.indexOf(val), 1);
        this.blockContactsCount -= 1;
      }
    },

    blockSelectedContacts(){
      const contactsArray = this.alphabetisedContacts;
      this.contactsToBlock = false;
      this.blockContactsCount = 0;

      for (let i = 0; i < this.blockContactsIDs.length; i++) {
        let selectedContact = this.blockContactsIDs[i];
        const blockContact = contactsArray.find(contact => contact.id === selectedContact);
        blockContact.contactBlocked = true
      }
      this.blockContactsIDs = [];
    },

    selectContactsToDelete(){
      this.isContactsOptionsDisplayed = false;
      this.contactsToDelete = true;
    },

    contactForDeletion(val){
      const deleteContactsArray = this.deleteContactsIDs;
      if(!deleteContactsArray.includes(val)){          
          deleteContactsArray.push(val);
          this.deleteContactsCount += 1;
      }else{
        deleteContactsArray.splice(deleteContactsArray.indexOf(val), 1);
        this.deleteContactsCount -= 1;
      }
    },

    deleteSelectedContacts(){
      const contactsArray = this.alphabetisedContacts;
      this.contactsToDelete = false;
      this.deleteContactsCount = 0;

      for (let i = 0; i < this.deleteContactsIDs.length; i++) {
        let selectedContact = this.deleteContactsIDs[i]
        contactsArray.splice(contactsArray.findIndex(v => v.id === selectedContact), 1);
      }
      this.deleteContactsIDs = [];
    },

    manageActiveMessage(){
      this.isActiveMessageOptionsDisplayed = true;
    },

    hideActiveMessageOptions(){
      this.isActiveMessageOptionsDisplayed = false;
    },

    blockSender(){
      const contactToBlock = this.messages.find(message => message.messageActive == true).messageID;
      const contactsArray = this.alphabetisedContacts;
      const blockContact = contactsArray.find(contact => contact.id === contactToBlock);
      blockContact.contactBlocked = true;
      this.messagesSelected = false;
      this.isActiveMessageOptionsDisplayed = false;
      this.deleteActiveMessage();      
    },

    deleteActiveMessage(){
      const messageToDelete = this.messages.find(message => message.messageActive == true).messageID;
      const messageArray = this.messages;
      messageArray.splice(messageArray.findIndex(v => v.messageID === messageToDelete), 1); 
      this.messagesSelected = false;
      this.isActiveMessageOptionsDisplayed = false;
    },

    leaveGroup(){
      const activeMessage = this.messages.find(message => message.messageActive == true);
      const activeMessageRecipientsIDArray = activeMessage.messageRecipientIDs;
      const activeMessageRecipientsNamesArray = activeMessage.messageRecipientNames;

      if(activeMessageRecipientsIDArray.includes(this.thisUserID)){
        this.deleteActiveMessage();
        activeMessage.recipientMessages.push({
          messageSenderID: 'memberLeftGroup',
          message: this.thisUserName + ' left the group.'
        })
        activeMessageRecipientsIDArray.splice(activeMessageRecipientsIDArray.findIndex(v => v.recipientID === this.thisUserID), 1);
        activeMessageRecipientsNamesArray.splice(activeMessageRecipientsNamesArray.findIndex(v => v.recipientName === this.thisUserName), 1);
      }
      
      this.messagesSelected = false;
      this.isActiveMessageOptionsDisplayed = false;
      this.cancelActiveMessage();
      
    },

    // searchMessages(val){
    //   this.searchMessageValue = val;
    // },
    searchContacts(val){
      this.searchContactValue = val;
    },

    getGroupsInterval(){
      setInterval(function () {
       axios.get("api/get_groups").then((res) => {
        this.messages = res.data;
       })
    }, 60000);
    }

  },
  computed:{
    // activeMessages(){
    //   const chosenMessageThread = this.messages.find(message => message.messageActive == true)

    //   return chosenMessageThread 
    // },
    // latestMessages(){
    //   //console.log(this.messages)
    //   let timeStampedMessages = this.messages

    //   if(this.searchMessageValue){
    //     timeStampedMessages = this.messages.filter(m => m.messageID.replace(/-/g, ' ').toLowerCase().indexOf(this.searchMessageValue) > -1)
    //   }
    //   // return timeStampedMessages.sort(function(x, y){
    //   //   return y.latestMessageTimestamp - x.latestMessageTimestamp;
    //   // })

    //   return timeStampedMessages
    // },

    alphabetisedContacts(){

      let unblockedContacts = this.contacts.filter(contacts => contacts.blocked == false)
      
      if(this.searchContactValue){
        unblockedContacts = this.contacts.filter(m => m.name.toLowerCase().indexOf(this.searchContactValue) > -1)
      }

      return unblockedContacts
      .filter(unblockedContacts => unblockedContacts.name.toLowerCase())
      .sort((a, b) => {
          if (a.name < b.name)
              return -1;
          if (a.name > b.name)
              return 1;
          return 0;
      });
    }
  },
  updated(){
    if(this.$el.querySelector(".active-messages__messages-list")){
      const container = this.$el.querySelector(".active-messages__messages-list");
      container.scrollTop = container.scrollHeight;
    }
  },
  mounted(){
    // if(this.profileID){
    //   console.log(this.profileID)
    // }

    for (let i = 0; i < this.messages.length; i++) {
      if(this.messages[i].messageRead == false){
        //this.$store.commit('messagesUnreadIncrement');
      } 
    }


    // const newContact = {
    //   id: this.$store.state.newContact.id,
    //   name: this.$store.state.newContact.contactName,
    //   contactProfilePic: this.$store.state.newContact.contactProfilePic,
    //   blocked: false
    // }
    //this.contacts.push(newContact);
    
    

    


    axios.get("api/get_groups").then((res) => {
      // console.log('gt groups api')
      // console.log(res)
      this.messages = res.data;
      //console.log(this.messages)
      this.messagesLoading = false;

      axios.get("api/get_contacts").then((res) => {
      //console.log(res.data)
      this.contacts = res.data;
      this.messagesLoading = false;
      // console.log(res.data)
      // console.log(this.contacts)


      if(this.$store.state.newContact.contactID){
        //console.log(this.$store.state.newContact.contactID)
      this.contactsListVisible = false;
      this.messagesListVisible = true;
      // console.log('gt contacts api')
      // console.log(this.messages)
      // if(this.messages.find(message => message.messageID === this.$store.state.newContact.contactID)){
      //   this.selectedMessage(this.$store.state.newContact.contactID);
        
      //   this.$store.commit('resetNewContact');
      // }

      for (let i = 0; i < this.messages.length; i++) {
        let groupUsers = this.messages[i];
        let groupUsersIDs = this.messages[i].users

        //console.log(groupUsers)
        //console.log(groupUsersIDs)

        //console.log(groupUsersIDs)

          if (groupUsers.users.length === 2 && groupUsersIDs.find(x => x.id === this.$store.state.newContact.contactID)) {
             //console.log('one 2 one')
             //console.log(groupUsers.id)
            this.newMessage = false;
            this.selectedMessage(groupUsers.id)
            //this.$store.commit('resetNewContact');
           // break;
            return true;
          }
      
      
      else{
        this.newMessage = true;
        this.chatName = this.$store.state.newContact.contactName
        const chosenContact = this.$store.state.newContact;
        this.messageRecipientNames = chosenContact.contactName;
        this.messageID = chosenContact.contactID
        // this.messages.unshift({
        //   messageID: chosenContact.id,
        //   messageRecipientNames: [chosenContact.name],
        //   recipientMessages:[],
        //   messageActive: true
        // });
        //this.$store.commit('resetNewContact');
      }
      }
    }
    });
      
    });

    this.getGroupsInterval();

    
    

  }
}
</script>

<style lang="scss" scoped>
  .messages-page{
    background-color: $copy;
    overflow: auto;
    

    @media(min-width: $desktop){
      background-color: transparent;
      grid-auto-rows: auto 1fr auto;
    }
  }


  .page-container{
    padding-top: $spacing-s;
    
    @media(min-width: $desktop){
      padding-top: $spacing-m;
      padding-bottom: $spacing-m;
    }
  }
  header,
  footer{
    display: none;

    @media(min-width: $desktop){
      display: block;
    }
  }

  .avatar-image{
    border-radius: 100%;
    overflow: hidden;
    text-indent: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &--fallback{
      background-color: #2A8470;
      color: #fff;
      font-weight: 600;
    }
  }

  .page-grid{
    @media(min-width: $desktop){
      display: grid;
      grid-template-columns: 400px 1fr;
    }
  }

  .messages-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1 0 auto;

    @media(min-width: $desktop){
      display: block;
      padding-right: $spacing-m;
    }

    &__back-link{
      width:rem(44);
      height: rem(44);
      color:#fff;
      display: flex;
      align-items:center;
      justify-content: center;
      text-decoration: none;
      font-weight: 300;
      font-size: rem(20);

      @media(min-width: $desktop){
        display: none;
      }

      &:before{
        font-family: "Font Awesome 5 Pro";
        content:'\f060';
      }
    }

    > .icon-button--back{
      background-color: transparent;
      color: #fff;
      @media(min-width: $desktop){
        display: none;
      }
    }

    h1{
      color: #fff;
      font-size: $copy-mobile-m;

      @media(min-width: $desktop){
        color:$copy;
        font-size: $copy-desktop-xl;
      }
    }

    &__button-container{
      display: flex;

      @media(min-width:$desktop){
        margin-top:$spacing-s;
        justify-content: space-between;
        background-color: $lightgrey;
        border-radius: $border-radius-reg;
        padding: $spacing-xs $spacing-s;
        position: relative;
      }

      .text-icon-button--back{
        display: none;

        @media(min-width:$desktop){
          display: flex;
        }
      }

      dialog{
        @media(min-width:$desktop){
          right: 0;
          left: auto;
          top: 100%;
        }
      }
    }

    .text-icon-button--new-message,
    .text-icon-button--ellipsis{
      color: #fff;
      width: rem(44);
      justify-content: center;

      @media(min-width:$desktop){
        width:auto;
        color:$copy;
        text-indent: 0;

        .sr-text{
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

      &:before{
        text-align: center;
        margin-right: 0;

        @media(min-width:$desktop){
          color:$copy;
          margin-right: $spacing-s;
        }
      }
    }
  }

  .search-bar-container{
    margin-top:$spacing-xs;

    @media(min-width:$desktop){
      margin-top:$spacing-s;
      margin-right: $spacing-m;
    }
  }

  .messages-loading{
    display: flex;
    justify-content: center;
    padding-top: $spacing-xl;
    color: #fff;
    @media(min-width:$desktop){
      padding-right: $spacing-m;
      color: $copy;
    }
  }

  .messages-list,
  .contacts-list,
  .group-contacts-list{
    @media(min-width:$desktop){
      overflow-y: auto;
      max-height: rem(410);
      padding-right: $spacing-m;
    }
    

    &__item{
      color:#fff;
      display: flex;
      align-items: center;
      border-top:rem(1) solid $dark-green;
      padding: $spacing-s 0;
      cursor: pointer;

      @media(min-width: $desktop){
        color:$copy;
        padding-left: $spacing-s;
        padding-right: $spacing-s;
      }

      &:first-of-type{
        border-top: none;
        margin-top:$spacing-s;
      }

      &--active{
        @media(min-width: $desktop){
          color: #fff;
          background-color: $copy;
          border-top-left-radius: $border-radius-reg;
          border-bottom-left-radius: $border-radius-reg;
          position: relative;
          margin-right:rem(-32);
          padding-right: rem(48);
        } 
      }

      &--new-group{
        font-size: $copy-mobile;
        
        &:before{
          content:'\f0c0';
          color:#fff;
          background-color: $dark-green;
          font-family: "Font Awesome 5 Pro";
          font-weight: 100;
          width:rem(36);
          height: rem(36);
          margin-right: $spacing-s;
          border-radius: 100%;
          display:flex;
          align-items: center;
          justify-content: center;
        }
      }

      &-checked-status{
        background-color:$lightgrey;
        width:rem(25);
        height: rem(25);
        position: relative;
        border-radius: 100%;
        margin-left: $spacing-s;

        &--checked:before{
          border-radius: 100%;
          position: absolute;
          height:rem(21);
          width:rem(21);
          content:'';
          left:rem(2);
          top:rem(2);
          background-color: $dark-green;

        }
      }
    }

    &__item-img{
      flex:0 0 rem(36);
      height: rem(36);
      overflow: hidden;
      border-radius: 100%;
      justify-content: center;
      align-items: center;
      display: flex;


      &--group,
      &--fallback{
        background-color: #2A8470;
        color: #fff;
        
      }

      &--group{
        &:before{
          font-family: "Font Awesome 5 Pro";
          font-weight: 300;
          font-size: $copy-mobile;
          content:'\f0c0';
        }
      }

      &--fallback{
        font-weight: 600;
        text-transform: capitalize;
      }
    }

    &__item-details{
      overflow: hidden;
      padding-left: $spacing-s;
      flex:1;
    }

    &__item-name{
      font-size: $copy-mobile;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: capitalize;

      span{
        margin-right: $spacing-xs;

        &:after{
          content: ',';
        }

        &:last-of-type{
          margin-right: 0;

          &:after{
            content: '';
          }
        }
      }
    }

    &__item-preview{
      color:#fff;
      font-size: $copy-mobile-s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media(min-width:$desktop){
        color:$copy;
        font-size: $copy-desktop-s;
      }
    }

    &__item-date{
      flex: 0 0 rem(60);
      text-align: right;
      font-size: $copy-mobile-xs;

      @media(min-width:$desktop){
        font-size: $copy-desktop-xs;
        flex: 0 0 rem(70);
      }
    }
  }

  .group-contacts-list__item-details{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .messages-list__item--active .messages-list__item-preview{
    @media(min-width:$desktop){
      color: #fff;
    }
  }

  .messages-list__item--active + .messages-list__item {
    border-top:none;
  }

  .active-messages{
    position: fixed;
    top: 0;
    right:0;
    bottom:0;
    left:0;
    background-color: $copy;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media(min-width:$desktop){
      position: relative;
      border-radius:$border-radius-reg;
      max-height: rem(535);
      height: 100%;
      min-height: rem(550);
    }
    

    &__header{
      display: flex;
      align-items: center;
      overflow: hidden;
      padding:$spacing-s;
      border-bottom:rem(1) solid $dark-green;
      position: relative;

      @media(min-width:$desktop){
        padding: $spacing-s $spacing-m;
        overflow: visible;
      }

      .icon-button{
        background-color: transparent;
        color: #fff;
        
      }

      .icon-button--back{
        @media(min-width:$desktop){
          display: none;
        }
      }


      h3{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: $copy-mobile;
        flex:1;
        text-align: center;
        padding-left:$spacing-s;
        padding-right:$spacing-s;

        @media(min-width:$desktop){
          text-align: left;
          font-size: $copy-desktop;
          padding-left: 0;

          .active-messages--new &{
            text-align: center;
            padding-left:$spacing-s;
          }
        }
      }
    }

    dialog{
      @media(min-width:$desktop){
        right: 0;
        left: auto;
        top: rem(65);
      }
    }

    .message-option-list{
      text-transform: capitalize;
      font-size: $copy-mobile-xs;
      @media(min-width:$desktop){
        font-size: $copy-desktop-xs;
      }
      li{
        margin-top:$spacing-xs;
        display: flex;
        align-items: center;
      }


      .avatar-image{
        width: rem(20);
        height: rem(20);
        margin-right: $spacing-xs;

        &--fallback{
          font-size: $copy-mobile-xs;
        }
      }
    }

    &__cancel-btn{
      background-color:transparent;
      color:#fff;
      height:rem(44);
      border:none;
      margin-right:$spacing-s;
      font-size: $copy-mobile-s;

      @media(min-width:$desktop){
        font-size: $copy-desktop-s;
      }
    }

    &__messages-list{
      display: flex;
      flex-direction: column;
      padding: 0 $spacing-s;
      overflow: auto;
      margin-bottom: rem(90);

      @media(min-width:$desktop){
        padding: 0 $spacing-m;
      }
    }

    &__message{
      padding:$spacing-s;
      max-width: 90%;
      display: block;
      width:fit-content;
      border-radius: $border-radius-reg;
      position:relative;
      line-height: 1.4;
      display: flex;
      align-items: flex-end;

      
      &:after {
        font-family: 'Font Awesome 5 Pro';
        content: '\f2ec';
        font-weight: 800;
        position: absolute;
        bottom:rem(-7);
      }

      &--user{
        background-color:$dark-green;
        margin-top:$spacing-s;
        align-self: flex-end;

        &:after{
          right:rem(-6);
          transform: rotate(20deg);
          color:$dark-green;
        }
      }

      &--recipient{
        background-color:$mid-grey;
        margin-top:rem(50);

        &:after{
          left:rem(-6);
          transform: rotate(-20deg);
          color:$mid-grey;
        }
      }

      &--double{
        margin-top:$spacing-s;
        .active-messages__message-sender{
          display: none;
        }
      }

      &--member-left,
      &--date-sent{
        margin: $spacing-m auto;
        background-color: transparent;
        font-size: $copy-mobile-xs;
        color: $lightgrey;
        border: rem(1) solid $lightgrey;
        padding: $spacing-xs;

        .active-messages__message-copy{
          margin:0;
          line-height: 1.2;
        }

        &:after{
          display: none;
        }
      }

      &-copy{
        display: inline-block;
        margin-right: $spacing-s;
      }

      &-sender{
        font-size: $copy-mobile-xs;
        position: absolute;
        top: rem(-20);
        left:0;
        text-transform: capitalize;

        @media(min-width:$desktop){
          font-size: $copy-desktop-xs;
          top: rem(-25);
        }
      }

      &-time{
        font-size: $copy-mobile-xs;
        display: inline-block;
        padding-bottom: rem(3);

        @media(min-width:$desktop){
          font-size: $copy-desktop-xs;
          padding-bottom: rem(2);
        }
      }
    }

    .active-messages__message--user{
      .active-messages__message-sender{
        display: none;
      }
    }

    .new-message-input-container{
      position: fixed;
      bottom:0;
      left:0;
      right:0;
      background-color: $copy;
      padding: $spacing-s;
      border-top: rem(1) solid $dark-green;

      @media(min-width:$desktop){
        position: absolute;
        border-bottom-left-radius: $border-radius-reg;
        border-bottom-right-radius: $border-radius-reg;
        padding: $spacing-s $spacing-m;
      }
    }
  }

  .no-messages{
    color: #fff;
    margin-top: $spacing-m;

    @media(min-width:$desktop){
      color: $copy;
    }
  }

  .group-chat-start,
  .delete-messages-count,
  .block-contacts-count,
  .delete-contacts-count{
    position: fixed;
    background-color: #fff;
    box-shadow: $box-shadow;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    padding: $spacing-s;

    @media(min-width:$desktop){
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    &__list{
      margin-top: $spacing-s;

      &:empty{
        margin: 0;
      }
    }

    &__list-item{
      display: inline-block;
      margin-left:rem(-10);

      &:first-of-type{
        margin-left: 0;
      }

      &--fallback,
      &--group{
        background-color:$dark-green;
        color: #fff;
        overflow: hidden;
        border-radius: 100%;
        text-align: center;
        font-size: $copy-mobile-xs;
        height: rem(25);
        width: rem(25);
        border:rem(1) solid #fff;
        padding-top:rem(6);
      }

      &--fallback{
        text-transform: capitalize;
        font-weight: 600;
      }

      &--group{
        &:before{
          font-family: "Font Awesome 5 Pro";
          font-weight: 300;
          font-size: $copy-mobile-xs;
          content:'\f0c0';
        }
      }
    }

    img{
      width:rem(25);
      height:rem(25);
      overflow: hidden;
      border-radius: 100%;
      border: rem(1) solid #fff;
    }

    .cta{
      margin-top: $spacing-s;
    }
  }

  .group-chat-start{
    .input-container{
      margin-top:0;
    }

    hr{
      width: 100%;
      height: rem(1);
      border: none;
      background-color: $lightgrey;
      margin: $spacing-m 0;
    }
  }
</style>
      
