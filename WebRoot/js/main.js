/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var PAMSapp = angular.module("PAMSapp", [
	"ui.router", 
    // "ui.calendar",
	"ui.bootstrap", 
	"oc.lazyLoad",  
	"ngSanitize",
	"angularBootstrapNavTree",
	"uiRouterStyles",
    // "angularjs-datetime-picker",
    // "ui.bootstrap.datetimepicker",
	"ngCookies",
	'angular.filter',
	"ngStorage",
	"ngFileUpload",
	"daypilot",
	// ,
	// "ngPrint"
	]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
PAMSapp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
        // global configs go here
	});
}]);

PAMSapp.filter('beginning_data', function() {
	return function(input, begin) {
		if (input) {
			begin = +begin;
			return input.slice(begin);
		}
		return [];
	}
});


//AngularJS v1.3.x workaround for old style controller declarition in HTML
PAMSapp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
	$controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
PAMSapp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
	var settings = {
		layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
          },
          assetsPath: 'assets',
          globalPath: 'assets/global',
          layoutPath: 'assets/layouts/layout4',
        };

        $rootScope.settings = settings;
        return settings;
      }]);

PAMSapp.factory("fileReader", function($q, $log) {
	var onLoad = function(reader, deferred, scope) {
		return function() {
			scope.$apply(function() {
				deferred.resolve(reader.result);
			});
		};
	};

	var onError = function(reader, deferred, scope) {
		return function() {
			scope.$apply(function() {
				deferred.reject(reader.result);
			});
		};
	};

	var onProgress = function(reader, scope) {
		return function(event) {
			scope.$broadcast("fileProgress", {
				total: event.total,
				loaded: event.loaded
			});
		};
	};

	var getReader = function(deferred, scope) {
		var reader = new FileReader();
		reader.onload = onLoad(reader, deferred, scope);
		reader.onerror = onError(reader, deferred, scope);
		reader.onprogress = onProgress(reader, scope);
		return reader;
	};

	var readAsDataURL = function(file, scope) {
		var deferred = $q.defer();

		var reader = getReader(deferred, scope);
		reader.readAsDataURL(file);

		return deferred.promise;
	};

	return {
		readAsDataUrl: readAsDataURL
	};
});

PAMSapp.factory('Excel',function($window){
	var uri='data:application/vnd.ms-excel;base64,',
	template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
	base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
	format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
	return {
		tableToExcel:function(tableId,worksheetName){
			var table=$(tableId),
			ctx={worksheet:worksheetName,table:table.html()},
			href=uri+base64(format(template,ctx));
			return href;
		}
	};
})

PAMSapp.factory('saNavigationGuard', ['$window', function($window) {
	var guardians = [];

	var onBeforeUnloadHandler = function(event) {
		var message;
		if (_.any(guardians, function(guardian) { return !!(message = guardian()); })) {
			(event || $window.event).returnValue = message;
			return message;
		} else {
			return undefined;
		}
	}

	var registerGuardian = function(guardianCallback) {
		guardians.unshift(guardianCallback);
		return function() {
			var index = guardians.indexOf(guardianCallback);
			if (index >= 0) {
				guardians.splice(index, 1);
			}
		};
	};

	if ($window.addEventListener) {
		$window.addEventListener('beforeunload', onBeforeUnloadHandler);
	} else {
		$window.onbeforeunload = onBeforeUnloadHandler;
	}

	return {
		registerGuardian: registerGuardian
	};
}]);

PAMSapp.factory('printService', [function() {
    var self = this;

    var printElement = function(e) {
      if (!angular.isElement(e))
        e = angular.element(e);
      
       if (e) {
            var params = ['height=' + window.screen.height,
              'width=' + window.screen.width,
              'fullscreen=yes' // only works in IE, but here for completeness
            ].join(',');

            var docStyle = angular.element(document.head).find('link');
            var hrefLink = "";

            hrefLink = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">';
            var domClone = e.cloneNode(true);
            var tpl = "<html><head>{css}</head><body>{element}</body>"
              .replace("{element}", angular.element(domClone).html())
              .replace("{css}", hrefLink);

            //var printSection = $compile(tpl)(scope);
            var printWindow = window.open('', '', params);

            printWindow.document.write(tpl);
            printWindow.print();
            printWindow.close();
            printWindow.document.close(); // necessary for IE >= 10
          }
    }

    self.PrintElement = printElement;

    return self;
  }]);

PAMSapp.directive("ngFileSelect", function(fileReader, $timeout) {
	return {
		scope: {
			ngModel: '='
		},
		link: function($scope, el) {
			function getFile(file) {
				fileReader.readAsDataUrl(file, $scope)
				.then(function(result) {
					$timeout(function() {
						$scope.ngModel = result;
					});
				});
			}

			el.bind("change", function(e) {
				var file = (e.srcElement || e.target).files[0];
				getFile(file);
			});
		}
	};
});
PAMSapp.directive('convertToNumber', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function(val) {
				return parseInt(val, 10);
			});
			ngModel.$formatters.push(function(val) {
				return '' + val;
			});
		}
	};
});

PAMSapp.directive('isolateScrolling', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			element.bind('DOMMouseScroll', function (e) {
				if (e.detail > 0 && this.clientHeight + this.scrollTop == this.scrollHeight) {
					this.scrollTop = this.scrollHeight - this.clientHeight;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
				else if (e.detail < 0 && this.scrollTop <= 0) {
					this.scrollTop = 0;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			});
			element.bind('mousewheel', function (e) {
				if (e.deltaY > 0 && this.clientHeight + this.scrollTop >= this.scrollHeight) {
					this.scrollTop = this.scrollHeight - this.clientHeight;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
				else if (e.deltaY < 0 && this.scrollTop <= 0) {
					this.scrollTop = 0;
					e.stopPropagation();
					e.preventDefault();
					return false;
				}

				return true;
			});
		}
	};
});

PAMSapp.directive('dragable', function(){   
  return {
    restrict: 'A',
    link : function(scope,elem,attr){
      $(elem).draggable();
    }
  }  
});

PAMSapp.directive('ngPrint', ["$compile","printService", function($compile,printService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        element.on('click', function() {

          var elToPrint = document.getElementById(attrs.printElementId);
          printService.PrintElement(elToPrint);
        });
      }
    };
  }]);


/* Setup App Main Controller */
PAMSapp.controller('AppController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
	$scope.$on('$viewContentLoaded', function() {
        App.initComponents(); // init core components
        if(($location.path() === '/login') || ($location.path() === '/register') || ($location.path() === '/reg_company') || ($location.path() === '/auth_company')){
        	$rootScope.sh_login = false;
        }else{
        	$rootScope.sh_login = true;
        }
        console.log($rootScope.sh_login);
        if($('body').hasClass('page-quick-sidebar-open')){
        	$('body').removeClass('page-quick-sidebar-open');        	
        }
        //if($scope.isStudent==false;
        //alert("$scope.isStudent=false");
      });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
PAMSapp.controller('HeaderController', ['$scope','$rootScope', '$localStorage', '$cookies', function($scope,$rootScope,$localStorage,$cookies) {
	$scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
        
      });

	(function initController() {
		console.log('HeaderController called...');
		if($cookies.get('user_fullname')!=undefined) $rootScope.tmpUser = $cookies.get('user_fullname');
		if($localStorage.avatar!=undefined) {
			$rootScope.tmpAvatar = $localStorage.avatar;
		}else if($rootScope.tmpAvatar ==undefined){
			$rootScope.tmpAvatar = 'img/user.png';
		}
		if($localStorage.rsSibar!=undefined) $rootScope.rsSibar = $localStorage.rsSibar;
		if($localStorage.user_types!=undefined) $rootScope.userTypes = $localStorage.user_types;
		if($localStorage.role!=undefined){
			$rootScope.role = $localStorage.role;
			// fn_actor($rootScope.role.id);
		} 
		if($localStorage.user_type_id!=undefined) $rootScope.user_type_id = $localStorage.user_type_id;
    	// $rootScope.rsSibar = {};
		if($localStorage.rsSibar) $rootScope.rsSibar = $localStorage.rsSibar;
		else $rootScope.rsSibar = {};
		
		/*$timeout(function () {
			$location.path('/login');
    	}, 200);*/
		
	})();
}]);

/* Setup Layout Part - Sidebar */
PAMSapp.controller('SidebarController', ['$rootScope','$scope','$timeout','$location','$localStorage','$cookies', function($rootScope,$scope,$timeout, $location,$localStorage, $cookies) {
	$scope.$on('$includeContentLoaded', function() {
         Layout.initSidebar(); // init sidebar
       });
	
	$rootScope.ch_actor = fn_actor;
	
	(function initController() {
		console.log('main controler called...');
		if($cookies.get('user_fullname')!=undefined) $rootScope.tmpUser = $cookies.get('user_fullname');
		if($localStorage.avatar!=undefined) $rootScope.tmpAvatar = $localStorage.avatar;
		if($localStorage.rsSibar!=undefined) $rootScope.rsSibar = $localStorage.rsSibar;
		if($localStorage.user_types!=undefined) $rootScope.userTypes = $localStorage.user_types;
		if($localStorage.role!=undefined){
			$rootScope.role = $localStorage.role;
			// fn_actor($rootScope.role.id);
		} 
		if($localStorage.user_type_id!=undefined) $rootScope.user_type_id = $localStorage.user_type_id;
    	// $rootScope.rsSibar = {};
		if($localStorage.rsSibar) $rootScope.rsSibar = $localStorage.rsSibar;
		else $rootScope.rsSibar = {};
		
		/*$timeout(function () {
			$location.path('/login');
    	}, 200);*/
		
	})();
    //-----------------------------------------------
	function fn_actor(a){
		//$cookies.put('user_type', a);
    if(a==1){//system admin
			$rootScope.rsSibar.student=false;
			
			$rootScope.rsSibar.empl=false;
			$rootScope.rsSibar.manager=false;
			$rootScope.rsSibar.sdept=false;
			$rootScope.rsSibar.dept=false;
			$rootScope.rsSibar.system = true;
			$timeout(function () {
				$location.path('/system/sysdash');
			}, 200);
		}else if(a==2){//Quan ly TTDV
			// $rootScope.InitFirstTime=true;
			$rootScope.rsSibar.student=false;
			$rootScope.rsSibar.empl=false;
			$rootScope.rsSibar.manager=true;
			$rootScope.rsSibar.sdept=false;
			$rootScope.rsSibar.dept=false;
			$rootScope.rsSibar.system = false;
			$timeout(function () {
				$location.path('/mdash');
			}, 200);
		}if(a==3){//Employee
    		/*$rootScope.rsSibar.student=false;
    		$rootScope.rsSibar.empl=false;
    		$rootScope.rsSibar.manager=false;
				$rootScope.rsSibar.sdept=false;
    		$rootScope.rsSibar.dept=false;
    		$rootScope.rsSibar.system = false;
    		$timeout(function () {
    			$location.path('/s_b');
    		}, 200);*/
		}else if(a==4){//Sieu phong ban - super department
			// $rootScope.InitFirstTime=true;
			$rootScope.rsSibar.student=false;
			$rootScope.rsSibar.empl=false;
			$rootScope.rsSibar.manager=false;
			$rootScope.rsSibar.sdept=true;
			$rootScope.rsSibar.dept=false;
			$rootScope.rsSibar.system = false;
			$timeout(function () {
				$location.path('/s_deptdash');
			}, 200);
		}else if(a==5){//Phong ban - department
			// $rootScope.InitFirstTime=true;
			$rootScope.rsSibar.student=true;
			$rootScope.rsSibar.empl=false;
			$rootScope.rsSibar.manager=false;
			$rootScope.rsSibar.sdept=false;
			$rootScope.rsSibar.dept=false;
			$rootScope.rsSibar.system = false;
			$timeout(function () {
				$location.path('/sbooking');
			}, 200);
		}else if(a==6){//Nguoi su dung phong - individual
			// $rootScope.InitFirstTime=true;
			$rootScope.rsSibar.student=true;
			$rootScope.rsSibar.empl=false;
			$rootScope.rsSibar.manager=false;
			$rootScope.rsSibar.sdept=false;
			$rootScope.rsSibar.dept=false;
			$rootScope.rsSibar.system = false;
			$timeout(function () {
				$location.path('/sbooking');
			}, 200);
		}else{
			
		}

		$localStorage.rsSibar = $rootScope.rsSibar;
	}
}]);

/* Setup Layout Part - Sidebar */
PAMSapp.controller('PageHeadController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
      });
}]);

/* Setup Layout Part - Quick Sidebar */
PAMSapp.controller('QuickSidebarController', ['$rootScope','$scope', function($rootScope,$scope) {    
	$scope.$on('$includeContentLoaded', function() {
		setTimeout(function(){
			
            QuickSidebar.init(); // init quick sidebar        
          }, 1000);
	});
	
}]);

/* Setup Layout Part - Theme Panel */
PAMSapp.controller('ThemePanelController', ['$scope', function($scope) {    
	$scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
      });
}]);

/* Setup Layout Part - Footer */
PAMSapp.controller('FooterController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
      });
}]);

/* Setup Rounting For All Pages */
PAMSapp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
	// $urlRouterProvider.otherwise("/login");  
	$urlRouterProvider.otherwise("/login");
	
	$stateProvider
	.state("dashboard", {
		url: "/dashboard",
		templateUrl: "app/dashboard/dashboard.html",
		data: {
			pageTitle: 'Dashboard',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "DashboardController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/dashboard/dashboard.controller.js',
						'app/dashboard/dashboard.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})
	.state("campusarea", {
		url: "/campusarea",
		templateUrl: "app/campusarea/campusarea.html",
		data: {
			pageTitle: 'BookingMngt',
			css:['assets/pages/css/login-3.css']
		},
		controller: "areaController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/campusarea/campusarea.controller.js',
						'app/campusarea/campusarea.service.js',
						'assets/global/plugins/fullcalendar/main.min.js',
												'assets/global/plugins/fullcalendar/main.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						
						'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
						'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
						'assets/pages/scripts/components-date-time-pickers.js'
					]                    
				});
			}]
		}
	
	})
	.state("teacherdashboard", {
		url: "/teacherdashboard",
		templateUrl: "app/teacherdashboard/teacherdashboard.html",
		data: {
			pageTitle: 'TeacherDashboard',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "TeacherDashboardController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/teacherdashboard/teacherdashboard.controller.js',
						'app/teacherdashboard/teacherdashboard.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})
	.state("teachercalendar", {
		url: "/t_cal",
		templateUrl: "app/teachercalendar/teachercalendar.html",
		data: {
			pageTitle: 'TeacherCalendar',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "TeacherCalendarController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/teachercalendar/teachercalendar.controller.js',
						'app/teachercalendar/teachercalendar.service.js',
						'app/teacherquiz/tquiz.service.js',
						'assets/global/plugins/fullcalendar/main.min.js',
						'assets/global/plugins/fullcalendar/main.min.css',
						'assets/global/plugins/fullcalendar/locales-all.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})
	.state("teacherprog", {
		url: "/t_prog",
		templateUrl: "app/teacherprog/tprog.html",
		data: {
			pageTitle: 'Prog Management',
			css:['assets/pages/css/login-3.css']
		},
		controller: "TeacherProgController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					
					files: [
						'app/teacherprog/tprog.controller.js',
						'app/teacherprog/tprog.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js'
						]                    
				});
			}]
		}
		
	})

	.state("teacherquizsession", {
		url: "/t_session",
		templateUrl: "app/teacherquizsession/t_session.html",
		data: {
			pageTitle: 'QuizSession',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "TeacherQuizSessionController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/teacherquizsession/t_session.controller.js',
						'app/teacherquizsession/t_session.service.js',
						'app/student/student.service.js',
						'app/teacherprog/tprog.service.js',
						'assets/global/plugins/fullcalendar/main.min.js',
						'assets/global/plugins/fullcalendar/main.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/libs/Highcharts-4.2.1/js/highcharts.js',
						'assets/libs/Highcharts-4.2.1/js/highcharts-more.js',

						'assets/global/plugins/highcharts/highcharts.js',
						'assets/global/plugins/highcharts/highcharts-more.js',
						'assets/global/plugins/highcharts/solid-gauge.js',
						'assets/global/plugins/highcharts/exporting.js',
						'assets/global/plugins/highcharts/export-data.js',
						'assets/global/plugins/highcharts/accessibility.js',

						'assets/libs/xls.js',
						'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
						'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
						'assets/pages/scripts/components-date-time-pickers.js'  
						]                    
				});
			}]
		}
	})


	.state("report", {
		url: "/report",
		templateUrl: "app/report/report.html",
		data: {
			pageTitle: 'Report Management',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "ReportController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/report/report.controller.js',
						'app/report/report.service.js',	                       
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/libs/xls.js',	                        
						'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
						'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
						'assets/pages/scripts/components-date-time-pickers.js' ,    
						'https://cdn.jsdelivr.net/alasql/0.3/alasql.min.js',
						'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.7.12/xlsx.core.min.js'
						]                    
				});
			}]
		}
	})
	.state("login", {
		url: "/login",
		templateUrl: "app/login/login.view.html",
		data: {
			pageTitle: 'Đăng nhập',
			css:['assets/pages/css/login-3.css']
		},
		controller: "LoginController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					name: 'PAMSapp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                        	'app/login/login.controller.js',
                        	'app/login/login.service.js',
                        	'assets/global/plugins/bootstrap-toastr/toastr.min.css',
                        	'assets/global/plugins/bootstrap-toastr/toastr.min.js'
                        	]                    
                      });
			}]
		}
	})
	.state("myprofile", {
		url: "/myprofile",
		templateUrl: "app/myprofile/myprofile.html",
		data: {
			pageTitle: 'MyProfile',
			css:['assets/pages/css/login-3.css']
		},
		controller: "MyProfileController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/myprofile/myprofile.controller.js',
						'app/myprofile/myprofile.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js'
						]                    
				});
			}]
		}
		
	})
	.state("org", {
		url: "/org",
		templateUrl: "app/org/org.html",
		data: {pageTitle: 'Org Management',
		css:['assets/pages/css/login-3.css']
	},
	controller: "OrgController",
	resolve: {
		deps: ['$ocLazyLoad', function($ocLazyLoad) {
			return $ocLazyLoad.load({

				files: [
					'app/org/org.controller.js',
					'app/org/org.service.js',
					'assets/global/plugins/bootstrap-toastr/toastr.min.css',
					'assets/global/plugins/bootstrap-toastr/toastr.min.js',
					'assets/libs/ng-table-master/dist/ng-table.min.css',
					'assets/libs/ng-table-master/dist/ng-table.min.js'
					]                    
			});
		}]
	}

})
	.state("tpl", {
		url: "/tpl",
		templateUrl: "app/tpl/tpl.html",
		data: {pageTitle: 'Template Management',
		css:['assets/pages/css/login-3.css']
	},
	controller: "TplController",
	resolve: {
		deps: ['$ocLazyLoad', function($ocLazyLoad) {
			return $ocLazyLoad.load({
				files: [
					'app/tpl/tpl.controller.js',
					'app/tpl/tpl.service.js',
					'assets/global/plugins/bootstrap-toastr/toastr.min.css',
					'assets/global/plugins/bootstrap-toastr/toastr.min.js',
					'assets/libs/ng-table-master/dist/ng-table.min.css',
					'assets/libs/ng-table-master/dist/ng-table.min.js'
					]                    
			});
		}]
	}
})
	.state("prog", {
		url: "/prog",
		templateUrl: "app/prog/prog.html",
		data: {pageTitle: 'Prog Management',
		css:['assets/pages/css/login-3.css']
	},
	controller: "ProgController",
	resolve: {
		deps: ['$ocLazyLoad', function($ocLazyLoad) {
			return $ocLazyLoad.load({

				files: [
					'app/prog/prog.controller.js',
					'app/prog/prog.service.js',
					'assets/global/plugins/bootstrap-toastr/toastr.min.css',
					'assets/global/plugins/bootstrap-toastr/toastr.min.js',
					'assets/libs/ng-table-master/dist/ng-table.min.css',
					'assets/libs/ng-table-master/dist/ng-table.min.js',
					'assets/libs/xls.js'
					]                    
			});
		}]
	}
})

	.state("mass", {
		url: "/mass",
		templateUrl: "app/mass/mass.html",
		data: {pageTitle: 'Mass Management',
		css:['assets/pages/css/login-3.css']
	},
	controller: "MassController",
	resolve: {
		deps: ['$ocLazyLoad', function($ocLazyLoad) {
			return $ocLazyLoad.load({

				files: [
					'app/mass/mass.controller.js',
					'app/mass/mass.service.js',
					'assets/global/plugins/bootstrap-toastr/toastr.min.css',
					'assets/global/plugins/bootstrap-toastr/toastr.min.js',
					'assets/libs/ng-table-master/dist/ng-table.min.css',
					'assets/libs/ng-table-master/dist/ng-table.min.js',
					'assets/global/css/kswitch.css'
					]                    
			});
		}]
	}
})
	.state("user", {
		url: "/user",
		templateUrl: "app/user/user.html",
		data: {pageTitle: 'User Management',
		css:['assets/pages/css/login-3.css']
	},
	controller: "UserController",
	resolve: {
		deps: ['$ocLazyLoad', function($ocLazyLoad) {
			return $ocLazyLoad.load({

				files: [
					'app/user/user.controller.js',
					'app/user/user.service.js',
					'assets/global/plugins/bootstrap-toastr/toastr.min.css',
					'assets/global/plugins/bootstrap-toastr/toastr.min.js',
					'assets/libs/ng-table-master/dist/ng-table.min.css',
					'assets/libs/ng-table-master/dist/ng-table.min.js'
					]                    
			});
		}]
	}

})
	.state("student", {
		url: "/student",
		templateUrl: "app/student/student.html",
		data: {pageTitle: 'Student Management',
		css:['assets/pages/css/login-3.css']
	},
	controller: "StudentController",
	resolve: {
		deps: ['$ocLazyLoad', function($ocLazyLoad) {
			return $ocLazyLoad.load({

				files: [
					'app/student/student.controller.js',
					'app/student/student.service.js',
					'assets/global/plugins/bootstrap-toastr/toastr.min.css',
					'assets/global/plugins/bootstrap-toastr/toastr.min.js',
					'assets/libs/ng-table-master/dist/ng-table.min.css',
					'assets/libs/ng-table-master/dist/ng-table.min.js',
					'assets/libs/printThis/printThis.js',
					'assets/libs/xls.js',
					'assets/global/plugins/bootstrap-select/bootstrap-select.css',
					'assets/global/plugins/bootstrap-select/bootstrap-select.min.js'
					]                    
			});
		}]
	}

})

	.state("student_nc", {
		url: "/student_nc",
		templateUrl: "app/student_nc/student_nc.html",
		data: {pageTitle: 'Student Management',
		css:['assets/pages/css/login-3.css']
	},
	controller: "StudentNCController",
	resolve: {
		deps: ['$ocLazyLoad', function($ocLazyLoad) {
			return $ocLazyLoad.load({

				files: [
					'app/student_nc/student_nc.controller.js',
					'app/student/student.service.js',
					'assets/global/plugins/bootstrap-toastr/toastr.min.css',
					'assets/global/plugins/bootstrap-toastr/toastr.min.js',
					'assets/libs/ng-table-master/dist/ng-table.min.css',
					'assets/libs/ng-table-master/dist/ng-table.min.js',
					'assets/libs/xls.js'
					]                    
			});
		}]
	}

})

	.state("studentdashboard", {
		url: "/s_b",
		templateUrl: "app/studentdashboard/studentdashboard.html",
		data: {
			pageTitle: 'StudentDashboard',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "StudentDashboardController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/studentdashboard/studentdashboard.controller.js',
						'app/studentdashboard/studentdashboard.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
		
	})
	.state("sbooking", {
		url: "/sbooking",
		templateUrl: "app/sbooking/sbooking.html",
		data: {
			pageTitle: 'RoomBooking',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "sbookingController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/sbooking/sbooking.controller.js',
						'app/sbooking/sbooking.service.js',
						// 'assets/global/plugins/fullcalendar/scheduler/index.global.min.js',
						// 'assets/global/plugins/fullcalendar/main.min.js',
						// 'assets/global/plugins/fullcalendar/main.min.css',
						// 'assets/global/plugins/fullcalendar/locales-all.js',
						// 'https://fullcalendar.io/js/fullcalendar-scheduler-1.5.0/scheduler.min.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js'
						]                    
				});
			}]
		}
	})
	/*.state("studenthistory", {
		url: "/s_hist",
		templateUrl: "app/studenthistory/shist.html",
		data: {
			pageTitle: 'StudentHistory',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "StudentHistController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/studenthistory/shist.controller.js',
						'app/studenthistory/shist.service.js',
						'app/studentprog/sprog.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js'
						]                    
				});
			}]
		}
	})*/
	.state("studentfeedback", {
		url: "/s_fb",
		templateUrl: "app/studentfeedback/s_fb.html",
		data: {
			pageTitle: 'StudentFeedback',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "StudentFBController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/studentfeedback/s_fb.controller.js',
						'app/studentfeedback/s_fb.service.js',
						'assets/global/plugins/fullcalendar/main.min.js',
						'assets/global/plugins/fullcalendar/main.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})
	.state("mdash", {
		url: "/mdash",
		templateUrl: "app/mdash/mdash.html",
		data: {
			pageTitle: 'Manager Dashboard',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "mdashController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/mdash/mdash.controller.js',
						'app/mdash/mdash.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',	   

						'assets/global/plugins/moment.min.js',
						'assets/libs/googlegaugecss.css',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})
	.state("mcal", {
		url: "/mcal",
		templateUrl: "app/mcal/mcal.html",
		data: {
			pageTitle: 'ManagerCalendar',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "mcalController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/mcal/mcal.controller.js',
						'app/mcal/mcal.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
						'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
						'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
						'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
						'assets/pages/scripts/components-date-time-pickers.js',	   
						// 'assets/global/plugins/fullcalendar/main.min.js',
						// 'assets/global/plugins/fullcalendar/main.min.css',
						// 'assets/global/plugins/fullcalendar/locales-all.js',
						'assets/global/plugins/fullcalendar/scheduler/index.global.min.js',

						'assets/global/plugins/moment.min.js',
						'assets/libs/googlegaugecss.css',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})

	.state("mbooking", {
            url: "/mbooking",
            templateUrl: "app/mbooking/mbooking.html",
            data: {
            	pageTitle: 'BookingMngt',
            	css:['assets/pages/css/login-3.css']
            },
	        controller: "mbookingController",
	        resolve: {
	            deps: ['$ocLazyLoad', function($ocLazyLoad) {
	                return $ocLazyLoad.load({
	                    files: [
	                        'app/mbooking/mbooking.controller.js',
	                        'app/mbooking/mbooking.service.js',
	                        'assets/global/plugins/fullcalendar/main.min.js',
													'assets/global/plugins/fullcalendar/main.min.css',
	                        'assets/global/plugins/bootstrap-toastr/toastr.min.css',
	                        'assets/global/plugins/bootstrap-toastr/toastr.min.js',
	                        'assets/libs/ng-table-master/dist/ng-table.min.css',
	                        'assets/libs/ng-table-master/dist/ng-table.min.js',
	                        
	                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
	                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
	                        'assets/pages/scripts/components-date-time-pickers.js'
	                    ]                    
	                });
	            }]
	        }
        
        })


	.state("mshift", {
            url: "/mshift",
            templateUrl: "app/mshift/mshift.html",
            data: {
            	pageTitle: 'ShiftMngt',
            	css:['assets/pages/css/login-3.css']
            },
	        controller: "mshiftController",
	        resolve: {
	            deps: ['$ocLazyLoad', function($ocLazyLoad) {
	                return $ocLazyLoad.load({
	                    files: [
	                        'app/mshift/mshift.controller.js',
	                        'app/mshift/mshift.service.js',
	                        'assets/global/plugins/fullcalendar/main.min.js',
							'assets/global/plugins/fullcalendar/main.min.css',
	                        'assets/global/plugins/bootstrap-toastr/toastr.min.css',
	                        'assets/global/plugins/bootstrap-toastr/toastr.min.js',
	                        'assets/libs/ng-table-master/dist/ng-table.min.css',
	                        'assets/libs/ng-table-master/dist/ng-table.min.js',
							'assets/global/plugins/fullcalendar/scheduler/index.global.min.js',

	                        
	                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
	                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
	                        'assets/pages/scripts/components-date-time-pickers.js'
	                    ]                    
	                });
	            }]
	        }
        
        })
		.state("mschedule", {
            url: "/mschedule",
            templateUrl: "app/mschedule/mschedule.html",
            data: {
            	pageTitle: 'ShiftMngt',
            	css:['assets/pages/css/login-3.css']
            },
	        controller: "mscheduleController",
	        resolve: {
	            deps: ['$ocLazyLoad', function($ocLazyLoad) {
	                return $ocLazyLoad.load({
	                    files: [
	                        'app/mschedule/mschedule.controller.js',
	                        'app/mschedule/mschedule.service.js',
	                        'assets/global/plugins/fullcalendar/main.min.js',
							'assets/global/plugins/fullcalendar/main.min.css',
	                        'assets/global/plugins/bootstrap-toastr/toastr.min.css',
	                        'assets/global/plugins/bootstrap-toastr/toastr.min.js',
	                        'assets/libs/ng-table-master/dist/ng-table.min.css',
	                        'assets/libs/ng-table-master/dist/ng-table.min.js',
							'assets/global/plugins/fullcalendar/scheduler/index.global.min.js',

	                        
	                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
	                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
	                        'assets/pages/scripts/components-date-time-pickers.js'
	                    ]                    
	                });
	            }]
	        }
        
        })
		.state("mtimetable", {
            url: "/mtimetable",
            templateUrl: "app/mtimetable/mtimetable.html",
            data: {
            	pageTitle: 'ShiftMngt',
            	css:['assets/pages/css/login-3.css']
            },
	        controller: "mtimetableController",
	        resolve: {
	            deps: ['$ocLazyLoad', function($ocLazyLoad) {
	                return $ocLazyLoad.load({
	                    files: [
	                        'app/mtimetable/mtimetable.controller.js',
	                        'app/mtimetable/mtimetable.service.js',
	                        'assets/global/plugins/fullcalendar/main.min.js',
							'assets/global/plugins/fullcalendar/main.min.css',
	                        'assets/global/plugins/bootstrap-toastr/toastr.min.css',
	                        'assets/global/plugins/bootstrap-toastr/toastr.min.js',
	                        'assets/libs/ng-table-master/dist/ng-table.min.css',
	                        'assets/libs/ng-table-master/dist/ng-table.min.js',
							'assets/global/plugins/fullcalendar/scheduler/index.global.min.js',

	                        
	                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
	                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
	                        'assets/pages/scripts/components-date-time-pickers.js'
	                    ]                    
	                });
	            }]
	        }
        
        })
		.state("mdevice", {
            url: "/mdevice",
            templateUrl: "app/mdevice/mdevice.html",
            data: {
            	pageTitle: 'Device',
            	css:['assets/pages/css/login-3.css']
            },
	        controller: "DeviceController",
	        resolve: {
	            deps: ['$ocLazyLoad', function($ocLazyLoad) {
	                return $ocLazyLoad.load({
	                    files: [
	                        'app/mdevice/mdevice.controller.js',
	                        'app/mdevice/mdevice.service.js',
	                        'assets/global/plugins/bootstrap-toastr/toastr.min.css',
	                        'assets/global/plugins/bootstrap-toastr/toastr.min.js',
	                        'assets/libs/ng-table-master/dist/ng-table.min.css',
	                        'assets/libs/ng-table-master/dist/ng-table.min.js'
	                    ]                    
	                });
	            }]
	        }
        
        })



	.state("managerprog", {
		url: "/m_prog",
		templateUrl: "app/managerprog/mprog.html",
		data: {
			pageTitle: 'ManagerProg',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "ManagerProgController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/managerprog/mprog.controller.js',
						'app/managerprog/mprog.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
						'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
						'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
						'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
						'assets/pages/scripts/components-date-time-pickers.js',	   

						'assets/global/plugins/moment.min.js',
						'assets/libs/googlegaugecss.css',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})
	.state("term", {
		url: "/term",
		templateUrl: "app/term/term.html",
		data: {
			pageTitle: 'Term',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "TermController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/term/term.controller.js',
						'app/term/term.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
						'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
						'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
						'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
						'assets/pages/scripts/components-date-time-pickers.js',	   

						'assets/global/plugins/moment.min.js',
						'assets/libs/googlegaugecss.css',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})
	.state("setup", {
		url: "/m_setup",
		templateUrl: "app/managersetup/setup.html",
		data: {
			pageTitle: 'Setup',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "SetupController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/managersetup/setup.controller.js',
						'app/managersetup/setup.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
						'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
						'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
						'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
						'assets/pages/scripts/components-date-time-pickers.js',	   

						'assets/global/plugins/moment.min.js',
						'assets/libs/googlegaugecss.css',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})

//===================================================================
	.state("managerquizstats", {
		url: "/m_stats",
		templateUrl: "app/managerquizstats/m_stats.html",
		data: {
			pageTitle: 'QuizStats1',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "ManagerQuizStatsController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/managerquizstats/m_stats.controller.js',
						'app/managerquizstats/m_stats.service.js',
						'app/prog/prog.service.js',
						'assets/global/plugins/fullcalendar/main.min.js',
						'assets/global/plugins/fullcalendar/main.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/libs/Highcharts-4.2.1/js/highcharts.js',
						'assets/libs/Highcharts-4.2.1/js/highcharts-more.js',
						'https://code.highcharts.com/highcharts-more.js',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})

	.state("managerquizstats_byques", {
		url: "/m_stats_byques",
		templateUrl: "app/managerquizstats/m_stats_byques.html",
		data: {
			pageTitle: 'QuizStats2',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "MStatsByQuesController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/managerquizstats/m_stats_byques.controller.js',
						'app/managerquizstats/m_stats.service.js',
						'app/prog/prog.service.js',
						'assets/global/plugins/fullcalendar/main.min.js',
						'assets/global/plugins/fullcalendar/main.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/libs/Highcharts-4.2.1/js/highcharts.js',
						'assets/libs/Highcharts-4.2.1/js/highcharts-more.js',
						'https://code.highcharts.com/highcharts-more.js',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})
//===================================================================

	    //-------------------------------------
	.state("facultydashboard", {
		url: "/facultydashboard",
		templateUrl: "app/facultydashboard/facultydashboard.html",
		data: {
			pageTitle: 'FacultyDashboard',
			css:['assets/pages/css/login-3.css']
		},
		
		controller: "FacultyDashboardController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/facultydashboard/facultydashboard.controller.js',
						'app/facultydashboard/facultydashboard.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						'assets/libs/xls.js'
						]                    
				});
			}]
		}
	})
        //-------------------------------------
	.state("systemdashboard", {
		url: "/system/systemdashboard",
		templateUrl: "app/system/systemdashboard.html",
		data: {
			pageTitle: 'SystemDashboard',
			css:['assets/pages/css/login-3.css']
		},
		controller: "SystemDashboardController",
		resolve: {
			deps: ['$ocLazyLoad', function($ocLazyLoad) {
				return $ocLazyLoad.load({
					files: [
						'app/system/systemdashboard.controller.js',
						'app/system/systemdashboard.service.js',
						'assets/global/plugins/bootstrap-toastr/toastr.min.css',
						'assets/global/plugins/bootstrap-toastr/toastr.min.js',
						'assets/libs/ng-table-master/dist/ng-table.min.css',
						'assets/libs/ng-table-master/dist/ng-table.min.js',
						
						'https://code.highcharts.com/highcharts.js',
						'https://code.highcharts.com/highcharts-more.js',
						'https://code.highcharts.com/modules/exporting.js'
						]                    
				});
			}]
		}
		
	})
}]);

/* Init global settings and run the app */
PAMSapp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
  }]);