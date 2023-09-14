angular
.module('PAMSapp')

.factory('TeacherDashboardService', 
		['$http', '$cookies', 
		 function($http, $cookies){
	var service = {};

	service.TeacherDashboardCounterApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/common/t_db_counter', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            });
	}

	service.ListClassUserApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/prog/listclassuser', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	} 

	/*service.TeacherClassListApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/user/teacher/myclass', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}*/

	service.TeacherClassListApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/prog/teacherclass', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}

	service.ListTeacherQuizSessionApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/t_quizsessions', reqData)
	    	.success(function (respData, status, headers, config) {
	    		callback(respData);
	    	})
	    	.error(function(respData, status, headers, config) {
	    	});
    }

	//---------------------term------------------------------------
	service.TermlistApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/timetable/term', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}
	
	return service;
}]);