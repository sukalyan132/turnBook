// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers','pdfBook.services','ionicImgCache'])

.run(function($ionicPlatform,$http,$rootScope,API) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
    ionic.Platform.setGrade('c');

  });

})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('dashboard', {
    url         : '/dashboard',
    templateUrl : 'template/dashboard.html',
    controller  : 'dashboardCnt'
  })
  .state('pdfBook', {
    url           : '/pdfBook',
    templateUrl   : 'template/book.html',
    controller    : 'pageSwipeController'
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/dashboard');
})

//.constant('BASE','http://192.168.1.6:3600/')
.constant('BASE','http://192.168.20.100:3000/')


