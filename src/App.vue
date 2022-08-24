<template>
  <router-view v-slot="slotProps">
    <transition name="fade" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>
</template>

<script>
export default {
 created(){

   return this.$store.commit('loggedIn')
 }
}
</script>

<style lang="scss">
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}

@font-face {
  font-family: Montserrat;
  src:  url("./assets/fonts/Montserrat-Regular.woff2") format("woff2"), // Super Modern Browsers
        url("./assets/fonts/Montserrat-Regular.ttf") format("truetype"); // Safari, Android, iOS
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}


@font-face {
  font-family: Montserrat;
  src:  url('./assets/fonts/Montserrat-SemiBold.woff2') format('woff2'), // Super Modern Browsers
        url('./assets/fonts/Montserrat-SemiBold.ttf') format('truetype'); //Safari, Android, iOS
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

html,
body {
  height:100%;
  -ms-text-size-adjust: none;
  -moz-text-size-adjust: none;
  -o-text-size-adjust: none;
  -webkit-text-size-adjust: none;
}

*,
*:before,
*:after{
  box-sizing: border-box;

  @media(-webkit-device-pixel-ratio: 1.5){
    //Windows 10 laptops scale the screens to 150% by default, this makes the whole site overly large, this should help to fix that (users will still be able to zoom in on the browser if they want to)
    zoom:.98;
  }
}

*:focus{
  outline-color: $focus;
}

body{
  font-family: 'Montserrat', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size:$copy-mobile;
  color: $copy;
  background-color: #fefefe;

  @media(min-width:$desktop){
    font-size:$copy-desktop;
  }
}


#app{
  display: grid;
  height: 100%;
  grid-template-columns: 100%;
  grid-template-rows: auto ;
  min-width: 0;
  width: 100%;
}

.page-outer{
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
}

p{
  line-height: $copy-line-height;
  overflow-wrap: break-word;
}

h1,
h2,
h3,
h4,
.h1,
.h2,
.h3,
.h4{
  color: inherit;
  font-weight: bold;
  line-height: $heading-line-height;
}

h1,
.h1{
  font-size: $copy-mobile-xl;

  @media(min-width:$desktop){
    font-size: $copy-desktop-xl;
  }
}

h2,
.h2{
  font-size: $copy-mobile-l;

  @media(min-width:$desktop){
    font-size: $copy-desktop-l;
  }
}

h3,
.h3{
  font-size: $copy-mobile-m;

  @media(min-width:$desktop){
    font-size: $copy-desktop-m;
  }
}

strong{
  font-weight: bold;
  line-height: 1.5;
}

.dialog-inner > strong{
  font-size: $copy-mobile-m;

  @media(min-width:$desktop){
    font-size: $copy-desktop-m;
  }
}

a{
  color: $link;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-thickness: rem(1);
  text-underline-offset: 0.1em;

  // p,h1,h2,h3,span{
  //   color: $link;
  // }

  &:hover{
    text-decoration-thickness: rem(2);
  }
}

 button{
    -webkit-appearance: none;
    cursor:pointer;
    transition: $ease-in-out;
    font-family: inherit;
    padding:0;
  }

  img{
    max-width: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    opacity: 1;
    transition: opacity .25s ease-in-out;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    
  }

  .error-enter-active, .error-leave-active {
    opacity: 1;
    transition: opacity .5s ease-in-out;
  }
  .error-enter, .error-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  .account-enter-active,
  .account-leave-active {
    transition: opacity 0.5s ease;

    @media(min-width:$desktop){
      transition: none;
    }
  }

  .account-enter-from,
  .account-leave-to {
    opacity: 0;
  }


  .spinner{
    -webkit-animation:spin 4s linear infinite;
    -moz-animation:spin 4s linear infinite;
    animation:spin 4s linear infinite;
    margin-right: $spacing-s;
    display: inline-block;
    &:before{
      content:'\f110';
      font-family: "Font Awesome 5 Pro";
    }
  }

  @-moz-keyframes spin { 
    100% { -moz-transform: rotate(360deg); } 
  }
  @-webkit-keyframes spin { 
      100% { -webkit-transform: rotate(360deg); } 
  }
  @keyframes spin { 
      100% { 
          -webkit-transform: rotate(360deg); 
          transform:rotate(360deg); 
      } 
  }

  .page-container{
    max-width: rem(1200);
    margin: 0 auto;
    width:100%;
    padding: $spacing-l $spacing-s rem(90) $spacing-s;

    @media(min-width:$desktop){
      padding: $spacing-l $spacing-m;
    }
  }

  .full-width{
    width: 100%;
  }

  .display-block{
    display: block;
  }

  .sr-text{
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
}

.error-message{
  background-color: $rag-red;
  color:#fff;
  border-radius: $border-radius-reg;
  padding: $spacing-s;
  font-weight: bold;
  text-align: center;
  box-shadow: $box-shadow;
}


.page-loading-message{
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-notification{
  background-color: transparent;
  color: transparent;
  position: fixed;
  font-weight: bold;
  padding: $spacing-s;
  z-index: 1;
  border-radius: $border-radius-reg;
  bottom:rem(-50);
  left: 50%;
  transform: translateX(-50%);
  transition: all .25s ease-in-out;

  &--active{
    bottom: $spacing-s;
    background-color: $dark-green;
    color: #fff;

  }
}

.modal-dialog__subheading{
  display: block;
  color:$mid-grey;
  font-size: $copy-mobile-xs;

  @media(min-width:$desktop){
    font-size: $copy-desktop-xs;
  }
}
</style>

