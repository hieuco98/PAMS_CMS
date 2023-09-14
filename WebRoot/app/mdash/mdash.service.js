angular
.module('PAMSapp')

.factory('mdashService', 
		['$http', '$cookies', 
		 function($http, $cookies){
	var service = {};
	
	service.TermlistApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/timetable/term', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}

	service.GetManagerDashboardCounterApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/common/getmanagerdashboardcounter', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            });
	}	
	service.GetRealtimeFeebackCounterApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/common/getrealtimefeedbackcounter', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            });
	}	
	 service.GetRecentlyInteractiveStatisticsApi=function(reqData, callback){
		 $http.post($cookies.get('hostname')+'/PAMS_api/prog/getrecentlyinteractivestatistics', reqData)
		 .success(function (respData, status, headers, config) {
            callback(respData);
		 })
		 .error(function(respData, status, headers, config) {
		 });
    }

    service.ListQuizSessionApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/m_quizsessions', reqData)
	    	.success(function (respData, status, headers, config) {
	    		callback(respData);
	    	})
	    	.error(function(respData, status, headers, config) {
	    	});
    }
	
	return service;
}]);