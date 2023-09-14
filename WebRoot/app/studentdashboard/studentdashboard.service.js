angular
.module('PAMSapp')

.factory('StudentDashboardService', 
		['$http', '$cookies', 
		 function($http, $cookies){
	var service = {};
	
	service.listBookingOrderApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/booking/listBookingOrder', reqData)
	    	.success(function (respData, status, headers, config) {
	    		callback(respData);
	    	})
	    	.error(function(respData, status, headers, config) {
	    	});
    }
	
	return service;
}]);