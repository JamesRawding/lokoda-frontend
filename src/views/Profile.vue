<template>
  <main>
    <h1>Profile</h1>
    <h2>{{profileName}}</h2>
    <h2>{{profileLocation}}</h2>
  </main>
</template>

<script>
export default {
  data() {
    return{
      profileName: '',
      profileLocation: '',
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
    ]
    }
    
  },
  created(){
    
    const url = this.$route.params.profileURL;
    const selectedUser = this.profiles.find(profile => profile.profileURL === url);
    this.profileName = selectedUser.profileName;
    this.profileLocation = selectedUser.profileLocation;

  }
}
</script>