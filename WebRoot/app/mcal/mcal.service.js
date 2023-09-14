angular
.module('PAMSapp')

.factory('mcalService', 
		['$http', '$cookies', 
		 function($http, $cookies){
	var service = {};
	

	//---------------------load calendar------------------------------------
	service.TeacherCalendarApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/calendar/teachercalendar', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}

	//---------------------class------------------------------------
	service.TeacherClassesApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/prog/teacherclass', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}

	service.ListStudentApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/classuser/new', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	
	service.GetMyOrgInfoApi=function(reqData, callback){
		$http.post($cookies.get('hostname') + '/PAMS_api/info/getmyorginfo', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}
	service.GetTeacherDashboardCounterApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/common/getteacherdashboardcounter', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            });
	}	
	service.ListRootProgApi=function(reqData, callback){
		 $http.post($cookies.get('hostname')+'/PAMS_api/prog/listroot', reqData)
		 .success(function (respData, status, headers, config) {
            callback(respData);
		 })
		 .error(function(respData, status, headers, config) {
		 });
    }
	 service.ListClassApi=function(reqData, callback){
		 $http.post($cookies.get('hostname')+'/PAMS_api/prog/listclass', reqData)
		 .success(function (respData, status, headers, config) {
            callback(respData);
		 })
		 .error(function(respData, status, headers, config) {
		 });
    }
	 service.GetProgStatisticsApi=function(reqData, callback){
		 $http.post($cookies.get('hostname')+'/PAMS_api/prog/getprogstatistics', reqData)
		 .success(function (respData, status, headers, config) {
            callback(respData);
		 })
		 .error(function(respData, status, headers, config) {
		 });
    }

    service.ListStudentApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/listclassuser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

    service.DeleteStudentApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/delclassuser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

    service.ListTemplateApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/tpl/listtemplate', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}
	//---------------------Prog------------------------------------
	service.GetRootProgsApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/prog/listroot', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}
	service.LoadAllProgTreeAPI=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/prog/listallprog', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}
	service.LoadProgTreeAPI=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/prog/listprog', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}

	service.ListClassStudentApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/listclassstudent', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

    service.QuizSessionStudentsApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/sessionattendees', reqData)
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

     service.GetTimeTableApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/timetable/get_ttb', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	service.GetTimetableOfClassApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/timetable/findClassByTime', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	service.GetTimetableOfClassByWeekApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/timetable/getTimeTableOfClassByTime', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }


    service.GetAreaByParentApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/campusarea/listareainbuilding', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}
	service.GetBuildingApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/campusarea/listbuilding', reqData)
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

	return service;
}]);