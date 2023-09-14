angular
.module('PAMSapp')

.factory('StudentService', 
		['$http', '$cookies', 
		 function($http, $cookies){
	var service = {};
	
	service.AddStudentFileApi=function(reqData, callback){
	     $http.post($cookies.get('hostname')+'/PAMS_api/mass/addstudentfile', reqData)
	      .success(function (respData, status, headers, config) {
	          callback(respData);
	      })
	      .error(function(respData, status, headers, config) {
	      });
	}
	
	service.GetOrgTreeApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/org/getorgtree', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            	alert("getorgtree error:"+respData);
            });
    }   

    
	service.UpdateStudentApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/updateaccount', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	service.CreateStudentApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/addstudent', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
    service.CreateStudentNCApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/addstudent_nc', reqData)
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

    service.DeleteStudentNCApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/delclassuser_nc', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }


	/*service.ListStudentApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/classuser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }*/

    service.ListStudentApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/student/liststudents', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

    service.ListClassStudentApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/student/listclassstudents', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

    service.ListBatchStudentApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/student/listbatchstudents', reqData)
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

    service.ListClassByProgApi=function(reqData, callback){
		 $http.post($cookies.get('hostname')+'/PAMS_api/prog/listprogclass_lite', reqData)
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
	//--------------------------------------------------------------------------------------------
	service.GetStudentStatisticsApi=function(reqData, callback){
		 $http.post($cookies.get('hostname')+'/PAMS_api/prog/getstudentstatistics', reqData)
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

	service.ListStudentClassApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/student/s_class', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

	service.AddClass2StudentApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/student/addclass', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	service.RemoveClassFromStudentApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/student/removeclass', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

    service.GetAllClassNCApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/getallncclass', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

    service.NCClassesApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/prog/ncclass', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }	

    service.UpdateStudentProfileApi=function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/updateprofile', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

    service.AddStudentstoClassApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/student/addstudenttoclass', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }

	return service;
}]);