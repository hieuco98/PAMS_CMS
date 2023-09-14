
angular
.module('PAMSapp')
.controller('LoginController',['$rootScope','$scope', '$location', '$localStorage', '$window', '$cookies', 'LoginService', 
  function($rootScope,$scope, $location, $localStorage, $window, $cookies, LoginService) {
   
    $scope.loginType = [
        {type: 1, name: 'Admin/System Admin'},
        {type: 2, name: 'CBQL'},
        {type: 3, name: 'PhongBan'},
        {type: 4, name: 'NVTruc'},
        {type: 4, name: 'User'}
    ];
    $scope.selectedLoginType = $scope.loginType[0];
   
    var hostname = 'http://localhost:8080';
    // var hostname = 'https://ezfeedback.vn';
   
    $rootScope.user_type_id=0;
   
    $scope.modelName = null;
    $scope.modelPwd = null;
   
    $scope.disabledLogin = false;
    $scope.clickLogin = fnClickLogin;
   
    (function initController() {
        localStorage.clear();
        $window.localStorage.clear();

        $cookies.put('hostname', hostname);
        console.log("login initController");
        $rootScope.InitFirstTime=false;
        LoginService.ClearCredentials();
    })();
   
    function fnClickLogin(){
        var reqData = {};

        reqData.username =$scope.modelName;
        reqData.password =$scope.modelPwd;

        $cookies.put('username',$scope.modelName);
        // $rootScope.tmpUser=$scope.modelName;

        LoginService.Login(reqData, function (respData) {
            if (respData.code == 200) {
        		 console.log(respData);

        		//if(respData.avatar){
                $rootScope.tmpUser=respData.user_fullname;
                $rootScope.tmpAvatar=respData.avatar;
                $scope.disabledLogin = false;

                // var types = respData.user_type_id;
                // $rootScope.userTypes = types;
                // $rootScope.role = $rootScope.userTypes[0];
                // if(types.length==1){
                //     $rootScope.user_type_id=types[0].id;
                // }else if(respData.user_type_id.length>1){
                //     var preferred_set = 0;
                //     for(var i=0;i<types.length; i++){
                //         if(types[i].is_preferred ==1){
                //             preferred_set = 1;
                //             $rootScope.user_type_id = types[i].id;
                //             $rootScope.role = $rootScope.userTypes[i];
                //             break;
                //         } 
                //     }
                //     if(preferred_set==0) $rootScope.user_type_id = types[0].id;
                // }
                $cookies.put('session_id', respData.session_id);
                $cookies.put('user_fullname', respData.user_fullname);

                $localStorage.avatar = respData.avatar;
                //$localStorage.user_type_id = $rootScope.user_type;
                // $localStorage.user_types = $rootScope.userTypes;
                // $localStorage.role = $rootScope.role;

                $scope.ch_actor(respData.user_type);

                console.log('goto dashboard');
            } else {
                $scope.disabledLogin = false;
                Swal.fire({
                    type: 'error',
                    title: 'Đã xảy ra lỗi...',
                    text: 'Login error:'+respData.description
                })
            }    		
        });
    }
    //-------------------------------------------------------------------------
    $scope.changeLoginType= function(logintype){
        $scope.selectedLoginType=logintype;
    };

    $scope.clickLoginWithCode = function fnclickLoginWithCode(){
        var reqData = {};
        reqData.usr_name = $scope.modelName;
        reqData.code = $scope.modelCode;
        reqData.device_token = $rootScope.s_firebaseToken;
        reqData.device_type = 'web';

        LoginService.LoginWithCode(reqData, function (respData) {
            if (respData.code == 200) {
                // console.log(respData);

                //if(respData.avatar){
                $rootScope.tmpUser=respData.user_fullname;
                $rootScope.tmpAvatar=respData.avatar;
                $scope.disabledLogin = false;

                var types = respData.user_type_id;
                $rootScope.userTypes = types;
                $rootScope.role = $rootScope.userTypes[0];
                if(types.length==1){
                    $rootScope.user_type_id=types[0].id;
                }else if(respData.user_type_id.length>1){
                    var preferred_set = 0;
                    for(var i=0;i<types.length; i++){
                        if(types[i].is_preferred ==1){
                            preferred_set = 1;
                            $rootScope.user_type_id = types[i].id;
                            $rootScope.role = $rootScope.userTypes[i];
                            break;
                        } 
                    }
                    if(preferred_set==0) $rootScope.user_type_id = types[0].id;
                }
                $cookies.put('session_id', respData.session_id);
                $cookies.put('user_fullname', respData.user_fullname);

                $localStorage.avatar = respData.avatar;
                $localStorage.user_type_id = $rootScope.user_type_id;
                $localStorage.user_types = $rootScope.userTypes;
                $localStorage.role = $rootScope.role;

                $scope.ch_actor($rootScope.user_type_id);

                console.log('goto dashboard');
            } else {
                $scope.disabledLogin = false;
                Swal.fire({
                    type: 'error',
                    title: 'Đã xảy ra lỗi.',
                    text: 'Login error:'+respData.description
                })
            }           
        });
    }


    $scope.clkResetPassword = function(){
        $scope.forgetPwd = !$scope.forgetPwd;
        fnRequestResetCode();
    }

    $scope.requestResetCode = fnRequestResetCode;
    function fnRequestResetCode(){
        var reqData = {};
        reqData.code = $scope.modelName;
        LoginService.RequestResetCode(reqData, function (respData) {
            if (respData.code == 200) {
                Swal.fire({
                    type: 'info',
                    title: 'Đã gửi mã đăng nhập tạm thời tới email bạn dùng đăng ký tài khoản.',
                    text: ''
                })
                $scope.forgetPwd = false;
                $scope.loginWithCode = true;
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Đã xảy ra lỗi...',
                    text: 'RequestResetCode error:'+respData.description
                })
            }           
        });
    }

}])

.controller('navbarController', 
    ['$scope', '$location', '$window', 'LoginService', 
        function ($scope, $location, $window, LoginService) {
            var $html = $('html'), $win = $(window), wrap = $('.app-aside'), MEDIAQUERY = {};

            MEDIAQUERY = {
                desktopXL : 1200,
                desktop : 992,
                tablet : 768,
                mobile : 480
            };
            (function initController() {
                shrinkHeaderHandler();
            })();
        
            function shrinkHeaderHandler(){
            var navbar = $('header > .navbar'), shrinkOn = $('#topbar').length ? $('#topbar').outerHeight() : $('header').outerHeight();
            var logo = $('.navbar-brand').find('img').first(), scrollLogo = logo.data('scroll-logo'), originalLogo = logo.attr('src');
            if ( typeof (scrollLogo) !== 'undefined' && scrollLogo !== '') {
               var logoImage = new Image();
               logoImage.src = scrollLogo;

            }

            $win.scroll(function() {
                if ($('#topbar').length && !isSmallDevice()) {
                    if ($(document).scrollTop() > 40) {
                        navbar.addClass('navbar-fixed');
                    } else {
                        navbar.removeClass('navbar-fixed');
                    }
                } else {
                    navbar.removeClass('navbar-fixed');
                }
                if ($('.navbar-transparent').length || $('.navbar-transparent-none').length) {

                    if ($(document).scrollTop() > shrinkOn) {
                        navbar.addClass('smaller navbar-transparent-none').removeClass('navbar-transparent');
                        if ( typeof (scrollLogo) !== 'undefined' && scrollLogo !== '') {
                            logo.attr('src', scrollLogo);
                        }
                    } else {
                        navbar.removeClass('smaller navbar-transparent-none').addClass('navbar-transparent');
                        if ( typeof (scrollLogo) !== 'undefined' && scrollLogo !== '') {
                            logo.attr('src', originalLogo);
                        }
                    }

                } else {
                    $(document).scrollTop() > shrinkOn ? navbar.addClass('smaller') : navbar.removeClass('smaller');
                }
      
            });
        }
       
        }])
.controller('regisController', 
  ['$scope', '$location', '$window', 'LoginService', 
     function ($scope, $location, $window, LoginService) {
         $scope.disabledUsrSignup = false;
         $scope.modelUsrFullName = null;
         $scope.modelUsrMobile = null;
         $scope.modelUsrEmail = null;
         $scope.modelUsrName = null;
         $scope.modelUsrPassword = null;
         
         $scope.clickUsrSignup = fnClickUsrSignup;
         $scope.clickComSignup = fnClickComSignup;
         
         (function initController() {
            
            
         })();
         
         function fnClickUsrSignup(){
               $scope.disabledUsrSignup = true;
               var reqData = {};
               reqData.usr_fullname = $scope.modelUsrFullName;
               reqData.usr_email = $scope.modelUsrEmail;
               reqData.usr_mobile = $scope.modelUsrMobile;
               reqData.usr_name = $scope.modelUsrName;
               reqData.usr_pwd = $scope.modelUsrPassword;

               reqData.app = 'shiftwork';
               console.log(reqData);
               LoginService.Signup(reqData, function (respData) {
                if (respData.code == 200) {
                 $scope.disabledUsrSignup = false;
    //    		    			fnGetUserProfile(respData.sessionid);
                 $window.alert(respData.description);
             } else {
                 $scope.disabledUsrSignup = false;
                 $window.alert(respData.description);
             }    		
         });
         }	
         
         function fnClickComSignup(){
             $scope.disabledUsrSignup = true;
             var reqData = {};
             reqData.com_fullname = $scope.modelComFullname;
             reqData.com_addr = $scope.modelComAddr;
             reqData.com_mobile = $scope.modelComMobile;
             reqData.com_email = $scope.modelComEmail;
             reqData.com_admin = $scope.modelComAdmin;
             console.log(reqData);
             LoginService.CompanySignup(reqData, function (respData) {
                if (respData.code == 200) {
                   $scope.disabledUsrSignup = false;
//    		    			fnGetUserProfile(respData.sessionid);
                   $window.alert(respData.description);
               } else {
                   $scope.disabledUsrSignup = false;
                   $window.alert(respData.description);
               }    		
           });
         }
         
         
         
     }]);