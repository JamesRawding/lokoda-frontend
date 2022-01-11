<template>
  <main class="page-container">
    <the-header></the-header>
    <div class="page-grid">
      <section v-if="messagesListVisible">
        <div class="messages-header">
          <a class="messages-header__back-link" href="javascript:history.go(-1)"><span class="sr-only"> Go Back</span></a>
          <h1>Messages</h1>
          <div class="messages-header__button-container">
            <base-text-icon-button @click="showContacts" mode="text-icon-button text-icon-button--new-message" aria-label="new message"><span class="sr-text">New</span></base-text-icon-button>
            <base-text-icon-button mode="text-icon-button text-icon-button--ellipsis" aria-label="manage messages"><span class="sr-text">Manage</span></base-text-icon-button>
          </div>
        </div>
        <search-bar v-if="messages.length > 0" searchId="searchMessages" ariaLabel="search messages" searchPlaceholder="Search Messages"></search-bar>
        <div>
          <ul class="messages-list">
            <li 
            @click="selectedMessage(messageThread.messageRecipientID)" 
            @keypress.enter="selectedMessage(messageThread.messageRecipientID)" 
            class="messages-list__item" 
            :class="{'messages-list__item--active': messageThread.messageActive}" 
            v-for="messageThread in latestMessages" 
            :key="messageThread.messageRecipientID" 
            tabindex="0" 
            role="button">
              <div class="messages-list__item-img">
                <img src="../assets/images/dummy-profile-pic.jpg" :alt="messageThread.messageRecipientName + ' profile image'">
              </div>
              <div class="messages-list__item-details">
                <h2 class="messages-list__item-name">{{messageThread.messageRecipientName}}</h2>
                <p class="messages-list__item-preview">{{messageThread.latestMessage}}</p>
              </div>
              <span class="messages-list__item-date">{{messageThread.latestMessageDate}}</span>
            </li>
          </ul>
        </div>
        <div v-if="messages.length === 0" class="no-messages">
          <strong>You currently have no messages.</strong>
        </div>
      </section>


      <section v-else-if="contactsListVisible">
        <div class="messages-header">
          <base-icon-button @click="showMessageList" mode="icon-button icon-button--back" ariaLabel="back to messages"></base-icon-button>
          <h1>New Message</h1>
          <div class="messages-header__button-container">
            <base-text-icon-button @click="showMessageList" mode="text-icon-button text-icon-button--back">Messages</base-text-icon-button>
            <base-text-icon-button mode="text-icon-button text-icon-button--ellipsis" aria-label="manage messages"><span class="sr-text">Manage</span></base-text-icon-button>
          </div>
        </div>
        <search-bar v-if="contacts.length > 0" searchId="searchContacts" ariaLabel="search contacts" searchPlaceholder="Search Contacts"></search-bar>
        <div>
          <ul class="contacts-list">
            <li @click="startGroupMessage" class="contacts-list__item contacts-list__item--new-group">New Group</li>
            <li
            @click="startChat(contact.contactID)" 
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
          </ul>
        </div>
      </section>

      <section v-else-if="groupContactsListVisible">
        <div class="messages-header">
          <base-icon-button @click="showContacts" mode="icon-button icon-button--back" ariaLabel="back to contacts"></base-icon-button>
          <h1>New Group</h1>
          <div class="messages-header__button-container">
            <base-text-icon-button @click="showContacts" mode="text-icon-button text-icon-button--back">Contacts</base-text-icon-button>
            <base-text-icon-button mode="text-icon-button text-icon-button--ellipsis" aria-label="manage messages"><span class="sr-text">Manage</span></base-text-icon-button>
          </div>
        </div>
        <search-bar v-if="contacts.length > 0" searchId="searchContacts" ariaLabel="search contacts" searchPlaceholder="Search Contacts"></search-bar>
        <div>
          <ul class="group-contacts-list">
            <li
            @click="addGroupRecipient(contact.contactID)" 
            class="group-contacts-list__item"
            v-for="contact in alphabetisedContacts" 
            :key="contact.contactID" 
            tabindex="0" 
            role="checkbox"
            :aria-checked="groupChatContactsIDs.includes(contact.contactID) ? 'true' : 'false'"
            :aria-labelledby="contact.contactID+'-checkbox'">
              <div class="group-contacts-list__item-img">
                <img src="../assets/images/dummy-profile-pic.jpg" :alt="contact.contactName + ' profile image'">
              </div>
              <div class="group-contacts-list__item-details">
                <span class="sr-only" :id="contact.contactID+'-checkbox'"> Add {{contact.contactName}} to group chat </span>
                <h2 class="group-contacts-list__item-name">{{contact.contactName}}</h2>
                <div class="group-contacts-list__item-checked-status contacts-list__item-checked-status--checked" v-if="groupChatContactsIDs.includes(contact.contactID)"></div>
                <div class="group-contacts-list__item-checked-status" v-else></div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <div class="group-chat-start" v-if="groupChatContacts.length > 0">
        <span>{{groupChatCount}} people selected</span>
        <ul class="group-chat-start__list">
          <li class="group-chat-start__list-item" v-for="contact in groupChatContacts" :key="contact.contactID">
            <img src="../assets/images/dummy-profile-pic.jpg" :alt="contact.contactName + ' profile image'">
          </li>
        </ul>
        <base-button @click="startGroupChat"  role="button" mode="cta cta--primary">Start Group Chat</base-button>
      </div>

      <section v-if="newGroupMessage" class="active-messages active-messages--new">
        <div class="active-messages__header">
          <base-button @click="cancelMessage" buttonType="button" mode="active-messages__cancel-btn">Cancel <span class="sr-only">new message</span></base-button>
          <!-- <h3>{{messageRecipientName}}</h3> -->
          <base-icon-button buttonType="button" mode="icon-button icon-button--ellipsis" ariaLabel="more options"></base-icon-button>
        </div>
        <ul class="active-messages__messages-list">
          <!-- <li v-for="messages in activeMessages" :key="messages.messageTime + messages.messageDate" class="active-messages__message" :class="thisUserID === messages.messageSenderID ? 'active-messages__message--user' : 'active-messages__message--recipient'">
            <span class="active-messages__message-sender">{{messages.messageSenderName}}</span>
            <span class="active-messages__message-copy">{{messages.message}}</span>
            <span class="active-messages__message-time">{{messages.messageTime}}</span>
          </li> -->
        </ul>
        <div class="new-message-input-container">
          <!-- <new-message-input @sendNewMessage="submitNewMessage" ariaLabel="Send new message" inputId="newMessage"></new-message-input> -->
        </div>
      </section>


      <section v-if="newMessage" class="active-messages active-messages--new">
        <div class="active-messages__header">
          <base-button @click="cancelMessage" buttonType="button" mode="active-messages__cancel-btn">Cancel <span class="sr-only">new message</span></base-button>
          <h3>{{messageRecipientName}}</h3>
          <base-icon-button buttonType="button" mode="icon-button icon-button--ellipsis" ariaLabel="more options"></base-icon-button>
        </div>
        <ul class="active-messages__messages-list">
          <li v-for="messages in activeMessages" :key="messages.messageTime + messages.messageDate" class="active-messages__message" :class="thisUserID === messages.messageSenderID ? 'active-messages__message--user' : 'active-messages__message--recipient'">
            <span class="active-messages__message-sender">{{messages.messageSenderName}}</span>
            <span class="active-messages__message-copy">{{messages.message}}</span>
            <span class="active-messages__message-time">{{messages.messageTime}}</span>
          </li>
        </ul>
        <div class="new-message-input-container">
          <new-message-input @sendNewMessage="submitNewMessage" ariaLabel="Send new message" inputId="newMessage"></new-message-input>
        </div>
      </section>


      <section v-if="messagesSelected" class="active-messages">
        <div class="active-messages__header">
          <base-icon-button @click="closeMessage" buttonType="button" mode="icon-button icon-button--back" ariaLabel="close message"></base-icon-button>
          <h3>{{messageRecipientName}}</h3>
          <base-icon-button buttonType="button" mode="icon-button icon-button--ellipsis" ariaLabel="more options"></base-icon-button>
        </div>
        <ul class="active-messages__messages-list">
          <li v-for="messages in activeMessages" :key="messages.messageTime + messages.messageDate" class="active-messages__message" :class="thisUserID === messages.messageSenderID ? 'active-messages__message--user' : 'active-messages__message--recipient'">
            <span class="active-messages__message-sender">{{messages.messageSenderName}}</span>
            <span class="active-messages__message-copy">{{messages.message}}</span>
            <span class="active-messages__message-time">{{messages.messageTime}}</span>
          </li>
        </ul>
        <div class="new-message-input-container">
          <new-message-input @sendNewMessage="submitNewMessage" ariaLabel="Send new message" inputId="newMessage"></new-message-input>
        </div>
      </section>
    </div>
    
  </main>
</template>

<script>
import TheHeader from '../components/layouts/TheHeader.vue';
import BaseButton from '../components/UI/BaseButton.vue';
import BaseTextIconButton from '../components/UI/BaseTextIconButton.vue';
import BaseIconButton from '../components/UI/BaseIconButton.vue';
import NewMessageInput from '../components/UI/NewMessageInput.vue';
import SearchBar from '../components/UI/SearchBar.vue';

export default {
  components:{
    TheHeader,
    BaseButton,
    BaseTextIconButton,
    BaseIconButton,
    SearchBar,
    NewMessageInput
  },
  data(){
    return{
      messagesListVisible: true,
      messagesSelected: false,
      newMessage: false,
      thisUserID: 'down-to-folk',
      thisUserName: 'Down To Folk',
      thisUserNewMessage: '',
      thisUserNewMessageDate: '',
      thisUserNewMessageTime: '',
      messageRecipientName: '',
      messageRecipientID: '',
      contactsListVisible: false,
      groupContactsListVisible: false,
      groupChatContacts:[],
      groupChatContactsIDs:[],
      //the above is very hacky
      groupChatCount: 0,
      newGroupMessage: false,
      contacts:[
        {
          contactID: 'bon-jovi',
          contactName: 'Bon Jovi',
          contactProfilePic: '../assets/images/dummy-profile-pic.jpg',
          contactBlocked: false
        },
        {
          contactID: 'goldie-lookin-chain',
          contactName: 'Goldie Lookin Chain',
          contactProfilePic: '../assets/images/dummy-profile-pic.jpg',
          contactBlocked: false
        },
        {
          contactID: 'shawoddywoddy',
          contactName: 'Shawoddywoddy',
          contactProfilePic: '../assets/images/dummy-profile-pic.jpg',
          contactBlocked: false
        },
        {
          contactID: 'gary-glitter',
          contactName: 'Gary Glitter',
          contactProfilePic: '../assets/images/dummy-profile-pic.jpg',
          contactBlocked: true
        },
      ],
      messages:[
        {
          messageRecipientID: 'bon-jovi',
          messageRecipientName: 'Bon Jovi',
          messageRecipientProfilePic: '../assets/images/dummy-profile-pic.jpg',
          recipientMessages:[
            {
              messageSenderID: 'down-to-folk',
              messageSenderName: 'Down To Folk',
              messageTime: '20:00',
              messageDate: '3rd Oct',
              message: 'Hello World'
            },
            {
              messageSenderID: 'bon-jovi',
              messageSenderName: 'Bon Jovi',
              messageTime: '21:00',
              messageDate: '3rd Oct',
              message: 'Hello to you ello to you ello to you ello to you'
            }
          ],
          latestMessage: 'Hello to you ello to you ello to you ello to you',
          latestMessageDate: '3rd Oct',
          latestMessageTimestamp: 1641556236655,
          messageActive: false,
          groupMessage: false,
        },
        {
          messageRecipientID: 'bros',
          messageRecipientName: 'Bros',
          messageRecipientProfilePic: '../assets/images/dummy-profile-pic.jpg',
          recipientMessages:[
            {
              messageSenderID: 'down-to-folk',
              messageSenderName: 'Down To Folk',
              messageTime: '22:00',
              messageDate: '3rd Oct',
              message: 'Hello Cruel World'
            },
            {
              messageSenderID: 'bros',
              messageSenderName: 'Bros',
              messageTime: '23:00',
              messageDate: '4th Oct',
              message: 'Yo'
            },
            {
              messageSenderID: 'bros',
              messageSenderName: 'Bros',
              messageTime: '24:00',
              messageDate: '4th Oct',
              message: 'Ahh bello'
            }
          ],
          latestMessage: 'Ahh bello',
          latestMessageDate: '4th Oct',
          latestMessageTimestamp: 1641556236635,
          messageActive: false,
          groupMessage: false,
        },
        {
          groupMessageRecipientIDs: ['bros', 'bon-jovi'],
          groupMessageRecipientNames: ['Bros', 'Bon Jovi'],
          groupRecipientMessages:[
            {
              messageSenderID: 'down-to-folk',
              messageSenderName: 'Down To Folk',
              messageTime: '22:00',
              messageDate: '3rd Oct',
              message: 'Hello Cruel World'
            },
            {
              messageSenderID: 'bros',
              messageSenderName: 'Bros',
              messageTime: '23:00',
              messageDate: '4th Oct',
              message: 'Yo'
            },
            {
              messageSenderID: 'bon-jovi',
              messageSenderName: 'Bon Jovi',
              messageTime: '23:30',
              messageDate: '4th Oct',
              message: 'Alright'
            },
            {
              messageSenderID: 'bros',
              messageSenderName: 'Bros',
              messageTime: '24:00',
              messageDate: '4th Oct',
              message: 'Oi oi'
            }
          ],
          latestMessage: 'Oi oi',
          latestMessageDate: '1st Sep',
          latestMessageTimestamp: 1641556236435,
          messageActive: false,
          groupMessage: true,
        }
      ],
    }
  },
  methods:{
    cancelActiveMessage(){
      for (let i = 0; i < this.messages.length; i++) {
        this.messages[i].messageActive = false;
      }
    },
    closeMessage(){
      this.messagesSelected = false;
      this.contactsListVisible = false;
      this.messagesListVisible = true;
      this.cancelActiveMessage();
    },
    selectedMessage(val){
      this.cancelActiveMessage();
      const chosenMessage = this.messages.find(message => message.messageRecipientID === val);
      chosenMessage.messageActive = true;
      this.messagesSelected = true;
      this.newMessage = false;
      this.messageRecipientName = chosenMessage.messageRecipientName;
      this.messageRecipientID = chosenMessage.messageRecipientID;
    },
    submitNewMessage(val){
      const currentMessageThread = this.messages.find(message => message.messageActive == true).recipientMessages;
      const latestMessageInfo = this.messages.find(message => message.messageActive == true);
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
      const currentTime = currentDate.getHours() + ":" + (currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes();
      const currentDayMonth = currentDayFormatted + " " + currentMonth;
      this.thisUserNewMessage = val;

      if(this.thisUserNewMessage != ''){
        currentMessageThread.push({
          messageSenderID: this.thisUserID,
          messageSenderName: this.thisUserName,
          messageTime: currentTime,
          messageDate: currentDayMonth,
          message: this.thisUserNewMessage
        });
        latestMessageInfo.latestMessage = this.thisUserNewMessage;
        latestMessageInfo.latestMessageDate = currentDayMonth;
        latestMessageInfo.latestMessageTimestamp = new Date().getTime();
        this.newMessage = false;
        this.selectedMessage(latestMessageInfo.messageRecipientID)
      }
      
    },
    showContacts(){
      this.cancelActiveMessage();

      
      this.contactsListVisible = true;
      this.groupContactsListVisible = false;
      this.messagesListVisible = false;
      this.messagesSelected = false;
      
    },
    showMessageList(){
      this.contactsListVisible = false;
      this.messagesListVisible = true;
    },
    startGroupMessage(){
      this.contactsListVisible = false;
      this.groupContactsListVisible = true;
      this.messagesListVisible = false;
    },
    startChat(val){
      this.contactsListVisible = false;
      this.messagesListVisible = true;
      if(this.messages.find(message => message.messageRecipientID === val)){
        this.selectedMessage(val)
      }else{
        this.newMessage = true;
        const chosenContact = this.contacts.find(contact => contact.contactID === val);
        this.messageRecipientName = chosenContact.contactName
        this.messageRecipientID = chosenContact.contactID
        
        
        this.messages.unshift({
          messageRecipientID: chosenContact.contactID,
          messageRecipientName: chosenContact.contactName,
          recipientMessages:[],
          messageActive: true

        });
      }
    },
    startGroupChat(){
      this.groupContactsListVisible = false;
      this.newGroupMessage = true;
      //push group chat contacts somewhere here

      this.groupChatContacts = [];

    },
    addGroupRecipient(val){
      const groupArray = this.groupChatContacts;
      const groupIDsArray = this.groupChatContactsIDs;
      //the above is a little hacky
      const contact = this.contacts.find(contact => contact.contactID === val);
      if(!groupArray.includes(contact)){          
          groupArray.push(contact);
          groupIDsArray.push(val);
          this.groupChatCount += 1
      }else{
          groupArray.splice(groupArray.indexOf(contact), 1);
          groupIDsArray.splice(groupIDsArray.indexOf(val), 1);
          this.groupChatCount -= 1
      }
    
    },
    cancelMessage(){
      this.messages.shift();
      this.newMessage = false;
      this.cancelActiveMessage();
    },
    cancelGroupMessage(){
      this.newGroupMessage = false;
      this.groupContactsListVisible = true;
    }
  },
  computed:{
    activeMessages(){
      const chosenMessageThread = this.messages.find(message => message.messageActive == true).recipientMessages
      return chosenMessageThread 
    },

    latestMessages(){
      const timeStampedMessages = this.messages
      return timeStampedMessages.sort(function(x, y){
          return y.latestMessageTimestamp - x.latestMessageTimestamp;
      })
    },

    alphabetisedContacts(){
      const unblockedContacts = this.contacts.filter(contacts => contacts.contactBlocked == false)
      return unblockedContacts
      .filter(unblockedContacts => unblockedContacts.contactName.toLowerCase())
      .sort((a, b) => {
          if (a.contactName < b.contactName)
              return -1;
          if (a.contactName > b.contactName)
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
  }
}
</script>

<style lang="scss" scoped>
  .page-container{
    background-color: $copy;
    padding-bottom: $spacing-s;
    overflow: auto;

    @media(min-width: $desktop){
      background-color: #fff;
      padding-bottom: $spacing-m;
    }
  }
  header{
    display: none;

    @media(min-width: $desktop){
      display: flex;
    }
  }

  .page-grid{
    @media(min-width: $desktop){
      margin-top:$spacing-m;
      display: grid;
      grid-template-columns: 370px 1fr;
      grid-column-gap: $spacing-m;
    }
  }

  .messages-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1 0 auto;

    @media(min-width: $desktop){
      display: block;
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
      }

      .text-icon-button--back{
        display: none;

        @media(min-width:$desktop){
          display: flex;
        }
      }
    }

    .text-icon-button{
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
    }
  }

  .messages-list,
  .contacts-list,
  .group-contacts-list{

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
    }

    &__item-details{
      overflow: hidden;
      padding-left: $spacing-s;
      flex:1;
    }

    &__item-name{
      font-size: $copy-mobile;
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
      max-height: rem(600);
      min-height: rem(400);
    }
    

    &__header{
      display: flex;
      align-items: center;
      overflow: hidden;
      padding:$spacing-s;
      border-bottom:rem(1) solid $dark-green;

      @media(min-width:$desktop){
        padding: $spacing-s $spacing-m;
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
        margin-top:$spacing-m;

        &:after{
          left:rem(-6);
          transform: rotate(-20deg);
          color:$mid-grey;
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

    .active-messages__message--recipient + .active-messages__message--recipient{
      margin-top:$spacing-s;

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

  .group-chat-start{
    position: fixed;
    background-color: #fff;
    box-shadow: $box-shadow;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    padding: $spacing-s;

    &__list{
      margin-top: $spacing-s;
    }

    &__list-item{
      display: inline-block;
      margin-left:rem(-10);

      &:first-of-type{
        margin-left: 0;
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
</style>
      
