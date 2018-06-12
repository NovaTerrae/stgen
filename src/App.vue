<template>
  <div>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark secondary-color fixed-top text-white px-4">
        <!-- SideNav slide-out button -->
        <a href="#" data-activates="slide-out" @click="initialiseSidebar" class="button-collapse text-white" style="font-size: 1.5rem"><i class="fa fa-bars"></i></a>
        <div class="ml-auto">
            <span class="h5">Enter Courses</span>
        </div>
    </nav>
    <!--/.Navbar-->
    

    <!-- Sidebar navigation -->
    <div id="slide-out" class="side-nav fixed" :class="{'animated slideInLeft' : sidebarActive, 'animated slideOutLeft' : !sidebarActive}" style="background-image: url('./static/img/bg2.jpg'); background-size: cover; background-position: center; color: #fff;" :style="{'-webkit-transform: translateX(0), -ms-transform: translateX(0), transform: translateX(0)' : sidebarActive}" v-if="initSidebar">
        <ul class="custom-scrollbar">
            <!-- Logo -->
            <li>
                <div class="logo-wrapper waves-light">
                    <a href="#" style=" padding:  1rem; display:  flex;align-items:  center;">
                        <img src="./assets/img/stgen-icon-white-512x512.png" class="img-fluid flex-center d-inline" style="width: 50px;padding:  0;height:  auto;">
                        <h2 class="d-inline" style="padding:  1rem;font-size:  1.6rem;margin-bottom:  0; font-family: 'Roboto Slab'">STGEN</h2>
                    </a>
                </div>
            </li>
            <!--/. Logo -->
            <!--Social-->
            <li>
                <ul class="social">
                    <li><a href="https://www.facebook.com/hellesanmi.santiago" class="icons-sm fb-ic"><i class="fa fa-facebook"> </i></a></li>
                    <li><a href="https://github.com/itope84" class="icons-sm pin-ic"><i class="fa fa-github"> </i></a></li>
                    <li><a href="#" class="icons-sm gplus-ic"><i class="fa fa-google-plus"> </i></a></li>
                    <li><a href="https://twitter.com/aidansantiago97" class="icons-sm tw-ic"><i class="fa fa-twitter"> </i></a></li>
                </ul>
            </li>
            <!--/Social-->
            
            <!-- Side navigation links -->
            <li class="social p-2">
                STGEN is an app that lets you quickly scaffold a study timetable, given a number of courses with their priority. <br>

            </li>
            <li class="p-2">
              <b>Coming Soon:</b><br>
                We will be able to save timetables to view offline or download as pdf
            </li>
            <!--/. Side navigation links -->
            <li style="position: absolute; bottom: 2vh" class="text-center">Built By <a href="https://itope84.github.io" class="text-secondary">Ilesanmi Temitope Santiago</a></li>
        </ul>
    </div>
    <div id="sidenav-overlay" @click="sidebarActive=false" v-if="sidebarActive"></div>
    <!--/. Sidebar navigation -->
  </header>

  <main>
    <div class="container mt-5 pt-3">
      <router-view></router-view>
    </div>
  </main>
  </div>

</template>

<script>
// require('./assets/js/mdb-pro.min.js');

export default {
  props: {
    activateSidebar: {dafault: false}
  },

  name: 'app',

  data () {
    return {
      sidebarActive: false,
      initSidebar: false
    }
  },
  mounted () {
    this.sidebarActive = this.activateSidebar
  },
  methods: {
    initialiseSidebar () {
      this.initSidebar = true
      this.sidebarActive = true
    }
  }

}
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Roboto|Roboto+Slab|Kreon');
    @import url('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    @import url('./assets/css/mdb-pro.css');
    @import url('./assets/css/style.css');

    // Always show sidebar
    @media only screen and (max-width: 1440px){
      .side-nav.fixed {
          -webkit-transform: translateX(0);
          -ms-transform: translateX(0);
          transform: translateX(0);
      }
    }
</style>