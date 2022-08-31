<template>
<div class="page-outer">
  <the-header :unreadMessageCounter="messageCount"></the-header>
  <main class="page-container">
    <h1><strong>Cookies List</strong></h1>
  
<table tabindex="0" summary="Table describing the websites uses of cookies">
    <thead>
      <tr>
        <th>Host</th>
        <th>Cookie name</th>
        <th>Retention Period</th>
        <th>Purpose</th>
        <th>Linked to individual user data</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>http://lokoda.co.uk/</td>
        <td>loggedIn</td>
        <td>60 mins</td>
        <td>Used to check if user is logged in</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td>http://lokoda.co.uk/</td>
        <td>cookiesAccepted</td>
        <td>30 days</td>
        <td>Used to remember if cookies have been accepted</td>
        <td>No</td>
      </tr>
      <tr>
        <td>http://lokoda.co.uk/</td>
        <td>thirdPartyAccepted</td>
        <td>30 days</td>
        <td>Used to remember if third-party cookies have been accepted</td>
        <td>No</td>
      </tr>
      <tr>
        <td>https://soundcloud.com/</td>
        <td>sc_anonymous_id</td>
        <td>10 years</td>
        <td>This cookie helps track visitor usage, events, target marketing, and can also measure application performance and stability.</td>
        <td>No</td>
      </tr>
      <tr>
        <td>https://open.spotify.com/</td>
        <td>sp_landing</td>
        <td>1 month</td>
        <td>This cookie helps track visitor usage, events, target marketing, and can also measure application performance and stability.</td>
        <td>No</td>
      </tr>
      <tr>
        <td>https://open.spotify.com/</td>
        <td>sp_t</td>
        <td>1 year</td>
        <td>This cookie helps track visitor usage, events, target marketing, and can also measure application performance and stability.</td>
        <td>No</td>
      </tr>
      <tr>
        <td>https://bandcamp.com/</td>
        <td>_ga</td>
        <td>2 years</td>
        <td>This cookie helps track visitor usage, events, target marketing, and can also measure application performance and stability.</td>
        <td>No</td>
      </tr>
      <tr>
        <td>https://bandcamp.com/</td>
        <td>_gid</td>
        <td>1 month</td>
        <td>This cookie helps track visitor usage, events, target marketing, and can also measure application performance and stability.</td>
        <td>No</td>
      </tr>
      <tr>
        <td>https://bandcamp.com/</td>
        <td>BACKENDID</td>
        <td>Session</td>
        <td>This cookie helps track visitor usage, events, target marketing, and can also measure application performance and stability.</td>
        <td>No</td>
      </tr>
      <tr>
        <td>https://bandcamp.com/</td>
        <td>client_id</td>
        <td>10 years</td>
        <td>This cookie helps track visitor usage, events, target marketing, and can also measure application performance and stability.</td>
        <td>No</td>
      </tr>



      

     
      
    </tbody>
  </table>
   
    

  </main>
  
  <the-footer></the-footer>
  </div>
</template>



<script>
import axios from "axios";
import TheHeader from '../components/layouts/TheHeader.vue';
import TheFooter from '../components/layouts/TheFooter.vue';

export default ({
  components:{
    TheHeader,
    TheFooter
  },
  data(){
    return {
      messageCount: 0,
    }
    
  },
  mounted(){
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
  }
})

</script>

<style lang="scss" scoped>

table{
  margin-top: $spacing-l;
  table-layout: fixed;
  overflow-x: auto;
  width: 100%;
  display: block;
  border: rem(1) solid $mid-grey;
  background-color: #fff;
  color: $copy;
  position: relative;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  scrollbar-width: thin;
  font-size: inherit;

  @media(min-width:$desktop){
    display: table;
    table-layout: auto;
  }

  th{
    font-weight: 600;
    text-align: left;
  }

  th,td{
    padding:$spacing-s;
    line-height: 1.4;
  }

  tr{
    border-bottom: rem(1) solid $mid-grey;
  }

  tbody tr:last-of-type{
    border: none;
  }
}

</style>



