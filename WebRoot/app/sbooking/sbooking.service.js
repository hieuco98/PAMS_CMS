angular
.module('PAMSapp')

.factory('sbookingService', 
		['$http', '$cookies', 
		 function($http, $cookies){
	var service = {};
	
	service.ListStudentQuizSessionApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/s_quizsessions', reqData)
	    	.success(function (respData, status, headers, config) {
	    		callback(respData);
	    	})
	    	.error(function(respData, status, headers, config) {
	    	});
    }

	service.GetAreaByParentApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/campusarea/area_by_parent', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}

	service.ListRoomApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/campusarea/area_by_parent', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}
	service.GetAvailableRoomsApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PAMS_api/booking/getAvailableRoom', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }	
	service.CreateBookingOrderApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/booking/createbooking', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
 	}
	
	return service;
}]);