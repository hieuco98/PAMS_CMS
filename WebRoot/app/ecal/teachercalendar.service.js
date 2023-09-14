angular
.module('PAMSapp')

.factory('TeacherCalendarService', 
		['$http', '$cookies', 
		 function($http, $cookies){
	var service = {};

	//---------------------term------------------------------------
	service.TermlistApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/timetable/term', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}

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

    service.AddStudentstoQuizSessionApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/attendees/add', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

    service.CreateQuizSessionApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/createquizsession_ed', reqData)
	    	.success(function (respData, status, headers, config) {
	    		callback(respData);
	    	})
	    	.error(function(respData, status, headers, config) {
	    	});
    }

    service.DeleteQuizSessionApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/deletequizsession', reqData)
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

    service.RemoveStudentFromQuizApi =function(reqData, callback){
	    	$http.post($cookies.get('hostname')+'/PAMS_api/student/doquiz/remove', reqData)
	        	.success(function (respData, status, headers, config) {
	        		callback(respData);
	        	})
	            .error(function(respData, status, headers, config) {
	            });
	    }
	return service;
}]);