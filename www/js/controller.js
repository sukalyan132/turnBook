angular.module('starter.controllers', [])
.controller('dashboardCnt',function($scope,$window,$http,API,$rootScope,BASE,$location){
  $scope.login=function(){
    $location.path('/pdfBook');
  }

})
.controller('pageSwipeController',function($scope,$window,$http,API,$rootScope,BASE){
$scope.config = {
            $bookBlock  : $( '#bb-bookblock' ),
            $navNext    : $( '#bb-nav-next' ),
            $navPrev    : $( '#bb-nav-prev' ),
            $navFirst   : $( '#bb-nav-first' ),
            $navLast    : $( '#bb-nav-last' )
          };

  /*********************************************************************/
  $scope.Page = (function() {
        
        
          $scope.init = function() {
            $scope.config.$bookBlock.bookblock( {
              speed       : 100,
              shadowSides : 0.8,
              shadowFlip  : 0.5
            } );
            $scope.initEvents();

          },
          $scope.initEvents = function() {
            
            var $slides = $scope.config.$bookBlock.children();
            // add navigation events
            $scope.config.$navNext.on( 'click touchstart', function() {
              $scope.config.$bookBlock.bookblock( 'next' );
              return false;
            } );
            $scope.config.$navPrev.on( 'click touchstart', function() {
              $scope.config.$bookBlock.bookblock( 'prev' );
              return false;
            } );
            $scope.config.$navFirst.on( 'click touchstart', function() {
              $scope.config.$bookBlock.bookblock( 'first' );
              return false;
            } );
            $scope.config.$navLast.on( 'click touchstart', function() {
              $scope.config.$bookBlock.bookblock( 'last' );
              return false;
            } );
            
            // add swipe events
            $slides.on( {
              'swipeleft' : function( event ) {
                $scope.config.$bookBlock.bookblock( 'next' );
                return false;
              },
              'swiperight' : function( event ) {
                $scope.config.$bookBlock.bookblock( 'prev' );
                return false;
              }
            } );
            // add keyboard events
            $( document ).keydown( function(e) {
              var keyCode = e.keyCode || e.which,
                arrow = {
                  left  : 37,
                  up    : 38,
                  right : 39,
                  down  : 40
                };
              switch (keyCode) {
                case arrow.left:
                  //console.log("here1");
                  $scope.config.$bookBlock.bookblock( 'prev' );
                  break;
                case arrow.right:
                  $scope.config.$bookBlock.bookblock( 'next' );
                  break;
              }
            } );
          };
          return { init : $scope.init };
      })();
  
  /*********************************************************************/
  //console.log(window.screen.height);
  $scope.hgt = { height: ($window.innerHeight-100) + 'px' };
  $scope.url=BASE;
  //$scope.books=[];
    API.post_details('','api/allFiles').success(function(data){
      //console.log(data);
      $scope.books=data.data;
      $scope.Page.init();
      angular.forEach(data.data, function(value, key) {
          var $book = $scope.config.$bookBlock.bookblock();
          $book.append('<div class="bb-item" ><a ><img  ion-img-cache src="'+$scope.url+''+value+'" alt="'+value+'"  width="100%" class="image-class" style="height: '+($window.innerHeight-100) +'px"/></a></div>');
          
          var $slides = $scope.config.$bookBlock.children();
            // add navigation events
            
            
            if(key=='0' || key==0)
            {
                $scope.config.$navFirst.on( 'click touchstart', function() {
                  $scope.config.$bookBlock.bookblock( 'first' );
                  return false;
                } );
            }
            if(key!=0)
            {
                $scope.config.$navPrev.on( 'click touchstart', function() {
                  $scope.config.$bookBlock.bookblock( 'prev' );
                  return false;
                } );
            }
            if(key!=(data.data.length-1))
            {
              $scope.config.$navNext.on( 'click touchstart', function() {
                $scope.config.$bookBlock.bookblock( 'next' );
                return false;
              } );
            }
            if(key==(data.data.length-1))
            {
                $scope.config.$navLast.on( 'click touchstart', function() {
                $scope.config.$bookBlock.bookblock( 'last' );
                return false;
              } );
            }
            
            
          $slides.on( {
              'swipeleft' : function( event ) {
                $scope.config.$bookBlock.bookblock( 'next' );
                return false;
              },
              'swiperight' : function( event ) {
                $scope.config.$bookBlock.bookblock( 'prev' );
                return false;
              }
            } );
      });
    })
  /*************************************************************************/
  //$scope.books=$rootScope.books;
  $scope.myValue={'page':''};
 $scope.warn = function () {
    //console.log($scope.config.$bookBlock.bookblock( 'current' ));
    $( '#bb-bookblock' ).bookblock( 'next' );
    return false;
            
    };
  $scope.swipRight = function(message){
    $( '#bb-bookblock' ).bookblock( 'prev' );
    
    return false;
  }
  $scope.showPage=function(){
    console.log($scope.myValue);
    $scope.config.$bookBlock.bookblock( 'jump', $scope.myValue.page);
              return false;
  }
  

})