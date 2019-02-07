angular.module('flipBook', [])

.directive('flipBook', [ '$ionicGesture', '$timeout',
	function($ionicGesture, $timeout) {
	
	var link = function(scope, el, attrs, ctrl, transclude) {
		
		/*---------- Local funs and vars ------------*/
		
		// page width will be set by user
		var pageWidth = 0;
		
		if(!scope.pageWidth || !scope.pageHeight) {
			pageWidth = 200;
			scope.pageWidth = '200px';
			scope.pageHeight = '500px';
		}
		else
			pageWidth = parseInt(scope.pageWidth);
			
		// fixed graphic parameters
		var shadowDim = 0;
		var shadowParam = ' 0px 50px 0px rgba(150,150,150,';
		var isAnimating = false;
		
		var pendingPages = [];
		
		// starting page index
		var pageIndex = scope.pageNumber ? parseInt(scope.pageNumber) : 0;
		
		// set it on pages
		var content = [];
		scope.length = 0;
		scope.selectedPage = {};
		scope.pageNumRef = {};
		
		scope.animateLeft = false;
		scope.animateRight = false;
		
		scope.pageNumRef = pageIndex + 1;
		
		
		var firstPage = scope.firstPage ? scope.firstPage : 'right';
		
		
		
		// get content from content manager (when dom is ready)		
		$timeout(function() {
			content = angular.element(document.querySelector('.content-manager')).children().clone();
			angular.element(document.querySelector('.content-manager')).remove();
			scope.length = content.length;
			changePage(scope.pageNumber);	
		}, 1000);
		
		
		var setPagesStruct = function(page) {
			var pg = parseInt(page);
		
			if(pg < -1 || pg > scope.length)
				return;
			
			if(firstPage == 'left')
				pg = (pg % 2 === 0) ? pg : pg + 1;
			else
				pg = (pg % 2 === 0) ? pg - 1 : pg;
					
			// selected page binding
			scope.selectedPage = { backLeft: pg - 1, left: pg, right: pg + 1, backRight: pg + 2 };
			
			
			return pg;
		}
		
		// set page (translate to left page index)
		var changePage = function(page) {
			var pg = setPagesStruct(page);
			
			scope.pageNumRef = scope.selectedPage;
			
			// page number binding (with external controller)
			scope.pageNumber = scope.selectedPage.right;
			
			for(var i = 0; i <= 5; i++) {
					var changePage = angular.element(document.querySelector('#page-' + i));
					var cnt = content[pg - 2 + i];
					changePage.empty();
					if(cnt)
						changePage.append(cnt);
				}
		};
		
		var isNumber = function(n) {
			return typeof n == 'number' && !isNaN(n) && isFinite(n);
		}

		// update status function
		var update = function(animation, page) {
			
			//var dir = (page.indexOf('right') >= 0) ? -1 : 1;	
			
			// check not apply or digest running and set changes
	    if(scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {   
					scope.$apply(function() {
	            if(page === 'leftPage')
								scope.animateLeft = animation;
							else
								scope.animateRight = animation;
	        });
	      } 
	      else {
	        if(page === 'leftPage')
						scope.animateLeft = animation;
					else
						scope.animateRight = animation;
	      }
		}
		
		var updateShadow = function(val, page) {
			
			var dir = (page.indexOf('right') >= 0) ? -1 : 1;	
			
			// check not apply or digest running and set changes
	    if(scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {   
					scope.$apply(function() {
	            scope.animData[page].backShadow = dir * shadowDim + 'px' + shadowParam + val + ')';
	        });
	      } 
	      else {
					scope.animData[page].backShadow = dir * shadowDim + 'px' + shadowParam + val + ')';
	      }
		}
		
		// animation function
		var animate = function(direction) {
			
			var page = (direction === 'right') ? 'leftPage' : 'rightPage';
			
			// calculate time (sec), acceleration (pixel/sec^2) and velocity (pixel/sec)
			var time_tot = scope.animationDuration ? parseInt(scope.animationDuration) / 1000 : 0.7;
			
			$timeout(function() {
				update(true, page);
			}, 0, true);	
					
			// do updating with browser refresh
			$timeout(function() {
				
				updateShadow(1, page);
				update(false, page);
				changePage(pageIndex);
				isAnimating = false;
			}, time_tot * 1000, true);	
			
			$timeout(function() {
				updateShadow(0, page);
			}, time_tot * 500, true);	

		}
		
		var setBackPages = function(dir) {
			
			var pageBack, pageBottom, cntBack, cntBottom;
			
			
			if(dir == 'left') {
				
				// get pages to edit
				pageBack = angular.element(document.querySelector('#page-1'));
				pageBottom = angular.element(document.querySelector("#page-0"));
				
				// get content to set
				cntBack = content[pageIndex + 1];
				cntBottom = content[pageIndex];
				
				scope.pageNumRef.backLeft = pageIndex + 1;
				
			}
			else {
				
				pageBack = angular.element(document.querySelector('#page-4'));
				pageBottom = angular.element(document.querySelector("#page-5"));
				
				cntBack = content[pageIndex];
				cntBottom = content[pageIndex + 1];
				
				scope.pageNumRef.backRight = pageIndex;
			}
			
			// empty pages
			pageBack.empty();
			pageBottom.empty();
			
			// set content (if not undefined)
			if(cntBack)
				pageBack.append(cntBack);
			
			if(cntBottom)
				pageBottom.append(cntBottom);
			
		}
		
		var goToPage = function(page) {
			
			if(scope.length === 0)
				return;
			
			// pageNum is now array index
			var pageNum;

			if(firstPage == 'left')
				pageNum = (page % 2 === 0) ? page : page - 1;
			else
				pageNum = (page % 2 === 0) ? page - 1 : page - 2;
				
				
			console.log("GOTOPAGE: " + pageNum);
			
			// if non-valid page number exit
			if(!isNumber(pageNum) || pageNum < -1 || pageNum >= scope.length)
				return;
				
			if(scope.selectedPage && (pageNum == scope.selectedPage.left || pageNum == scope.selectedPage.right)) 
				return;
				
				
			// if next page call gesture event (right or left)
			if(scope.selectedPage && pageNum == scope.selectedPage.backLeft) {
				gestureCall('right');
				return;
			}
			
			if(scope.selectedPage && pageNum == scope.selectedPage.backRight) {
				gestureCall('left');
				return;
			}
			
			// if(isAnimating) {
			// 	pendingPages.push(page);	
			// 	return;
			// }
			
			setPagesStruct(pageNum);	
			
			var animateSide = 'left'; 
			var setSide = 'right';
			
			// swap set back pages and animate vars
			if(pageNum < pageIndex) {
					animateSide = 'right';
					setSide = 'left';			
			}
			
			if(!isAnimating) {

				pageIndex = pageNum;
				setBackPages(setSide);
				isAnimating = true;
				animate(animateSide);
			}
			else
				pendingPages.push(page);		
		}; 
		
		// gesture event manager
		var gestureCall = function(dir) {
			
			var pg;
			
			var changed = false;
			
			// check if not animating and call animation
			if(dir == 'left' && scope.selectedPage.backRight < scope.length) {
				pg = pageIndex + 2;
				changed = true;
			}
			
			if(dir == 'right' && scope.selectedPage.backLeft > - 1) {
				pg = pageIndex - 2;
				changed = true;	
			}
			
			if(!scope.length || !changed || !isNumber(pg))
				return;
			
			setPagesStruct(pg);	
			
			if(!isAnimating) {
				pageIndex = pg;
				animate(dir);
				isAnimating = true;
			}
			else {
				if(firstPage == 'left')
					pendingPages.push(pg);
				else
					pendingPages.push(pg + 1);
			}
		};
		
		/*---------- Scope var and fun definition ---------*/
		
		// some graphic parameters
		scope.bookWidth = pageWidth * 2 + 'px';
		scope.coverWidth = (pageWidth * 2 + 40) + 'px';
		scope.coverHeight = (parseInt(scope.pageHeight) + 20) + 'px';
		scope.bindingLeft = pageWidth + 20 + 'px';
		
		// initial animation data for left and right pages
		scope.animData = { 
				leftPage: {
					translation: 'translate3D(0, 0, 0)',
					frontWidth: pageWidth + 'px',
					backWidth: '0px',
					
					// frontScale: 'scale3d(1,1,1)',
					// backScale: 'scale3d(0,1,1)',
					
					backShadow: shadowDim +'px' + shadowParam + '0)',
					shadowOpacity: '1',
					// shadowWidth: '0',
					transition: 'all 0ms ease-out'
				},
				
				rightPage: {
					translation: 'translate3D(0, 0, 0)',
					frontWidth: pageWidth + 'px',
					backWidth: '0px',
					
					// frontScale: 'scale3d(1,1,1)',
					// backScale: 'scale3d(0,1,1)',
					
					backShadow: (-shadowDim) + 'px' + shadowParam + '0)',
					shadowOpacity: '1',
					// shadowWidth: '0',
					transition: 'all 0ms ease-out'
				}
		};
		
		scope.$watch('setPage', function (value) {
				/*Checking if the given value is not undefined*/
				if(value){
					scope.setPage = value;
					/*Injecting the Method*/
					scope.setPage.invoke = function(v){
						// console.log("WATCH METHOD CALLED GOTOPAGE");
						goToPage(v);
					}
				}    
		});

		
		/*------------- Events listeners -----------*/
		
		if(scope.swipe !== false)
			$ionicGesture.on('swipeleft', function(ev) {
				gestureCall('left');
			}, el);
		
		if(scope.swipe !== false)
			$ionicGesture.on('swiperight', function(ev) {
				gestureCall('right');
			}, el);
		
		if(scope.doubleTap !== false)
			$ionicGesture.on('doubletap', function(ev) {
					
					var pgx = parseInt(ev.gesture.center.pageX);
					
					if(pgx) {
						
						var left = parseInt(this.children[0].offsetLeft);
						
						console.log("page x = " + (pgx - left));
						
						if(pgx - left <= pageWidth + 20)
							gestureCall('right');
						else
							gestureCall('left');
					}
					else
						console.log("NO CENTER COORDINATES");
					
						
			}, el);
	};
	
	/*--------- End of link function ----------*/
	
	return {

		// directive type is 'Element'
		restrict: 'E',
		
		scope: {

			// creates a data-items attribute which contains pages list
			//pages: "=",	
			
			// create an attribute select starting page
			pageNumber: "=",
			
			// page size
			pageWidth: "@",
			pageHeight: "@",
			
			// show or hide page numbers (boolean)
			showPageNums: "=",
			
			// animation time (millis)
			animationDuration: "=",
			
			//gesture enabling
			doubleTap:"=",
			swipe:"=",
			
			// first page (left or right)
			firstPage: "@",
			
			// invoke method
			setPage: '='
		},

		// link to template
		templateUrl: 'flipBookTemplate.html',
		
		// enable transclusion
		transclude: true,

		// link function which allow to edit DOM
		link: link
	};

}])