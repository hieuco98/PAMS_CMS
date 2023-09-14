angular
.module('PAMSapp')
.factory('LoginService', 
	['$http', '$rootScope', '$cookies' ,
		function($http,$rootScope, $cookies){
			var service = {};

			service.Login = Login;
			service.GetUserProfile = GetUserProfile;
			service.ClearCredentials = ClearCredentials;
			service.RequestResetCode = RequestResetCode;
			service.LoginWithCode = LoginWithCode;

			function Login(reqData, callback) {
		    	//alert("GET:"+$cookies.get('hostname'));

				$http.post($cookies.get('hostname')+'/PAMS_api/user/login', reqData)
				.success(function (respData, status, headers, config) {

		            	// console.log(respData);
					callback(respData);
				}).
				error(function(respData, status, headers, config) {
					callback(respData);
				});
			}

			function LoginWithCode(reqData, callback) {
				$http.post($cookies.get('hostname')+'/PAMS_api/user/loginwithcode', reqData)
				.success(function (respData, status, headers, config) {
					callback(respData);
				}).
				error(function(respData, status, headers, config) {
					callback(respData);
				});
			}

			function GetUserProfile(reqData, callback) {
				$http.post($cookies.get('hostname')+'/PAMS_api/user/getprofile', reqData)
				.success(function (respData, status, headers, config) {
					callback(respData);
				})
				.error(function(respData, status, headers, config) {
					callback(respData);
				});
			}


			function RequestResetCode(reqData, callback) {
				$http.post($cookies.get('hostname')+'/PAMS_api/user/requestresetcode', reqData)
				.success(function (respData, status, headers, config) {
					callback(respData);
				})
				.error(function(respData, status, headers, config) {
					callback(respData);
				});
			}

			function ClearCredentials() {
		    	//$rootScope.company_profile = {};
		    	//$rootScope.company.available = [];
		    	//$rootScope.company.selected = {};

		    	//$rootScope.user_profile = {};
		    	//$rootScope.user_picture = null;
		        //$cookies.remove('session');
		        //$cookies.remove('current_are');
		        //$cookies.remove('company_id');
		        //$cookies.remove('current_company_id');
		        //$sessionStorage.$reset();
			}

			return service;
			
		}]);