angular
.module('PAMSapp')

.factory('mTimetableService', 
		['$http', '$cookies', 
		 function($http, $cookies){
	
	var service = {};
	
	service.UploadTimeTable_new_Api = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/upload/new', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }
	service.GetDayTimeTableApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/getdaytimetable', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }
	service.ListLecturerApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/listlecturer', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }
	service.ListClassApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/listclass', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }
	service.ListFacultyApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/listfaculty', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }
	service.ListSubjectApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/listsubject', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }
	
	service.ListBuildingApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/listbuilding', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }
	service.ListClassRoomApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/listclassroom', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }	
	service.ListSchoolYearApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/listschoolyear', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }	
	service.ListSchoolYearApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/listschoolyear', reqData)
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
	service.ListSemesterApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/listsemester', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }	
	service.ListWeekApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/listweek', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }	
	//-------------------------------------------------------------
	service.GetClassTimeTableApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/getclasstimetable', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }	
	service.GetLecturerTimeTableApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/getlecturertimetable', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }	
	service.GetClassRoomTimeTableApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/getclassroomtimetable', reqData)
        .success(function (respData, status, headers, config) {
            callback(respData);
        })
        .error(function(respData, status, headers, config) {
        });
    }	
	service.GetFacultyTimeTableApi = function(reqData, callback){
        $http.post($cookies.get('hostname') + '/PTITIoCAPIs/timetable/getfacultytimetable', reqData)
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
	//---------------------------------------------
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