angular
.module('PAMSapp')

.factory('mbookingService', 
		['$http', '$cookies', 
		 function($http, $cookies){
	
	var service = {};
	
	service.UpdateCampusAreaApi=function(reqData, callback){
		$http.post($cookies.get('hostname') + '/PAMS_api/campusarea/updatecampusarea', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	}
	
	service. GetCampusAreaTreeApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/campusarea/getcampusareatree', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            	alert("getorgtree error:"+respData);
            });
    }   
	
	//-------------------------------------------------------------------------------------------
	service.listBookingOrderByAreaApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/booking/listbookingorderofarea', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
 	}
	 service.listBookingOrderApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/booking/listBookingOrder', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
 	}
	service.UpdateBookingOrderApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/booking/updatebookingorder', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
 	}
	service.updateBookingEnabledOptionApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/booking/updatebookingenabledoption', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
 	}
	service.RoomConflictCheckApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/booking/roomconflictcheck', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
 	}
	
 	//--------------------------------------------------------------------------------------------
 	service.ListLoaiCampusAreaApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/campusarea/listloaicampusarea', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
 	}
 
 	service.ListOwnerTypeApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/campusarea/listcampusownertype', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
 	}
 
	
 	service.ListBookingStateApi=function(reqData, callback){
		$http.post($cookies.get('hostname')+'/PAMS_api/booking/listbookingstate', reqData)
		.success(function (respData, status, headers, config) {
		    callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
 	}
 	service.ListTimeScheduleOfRoomApi=function (reqData, callback){
 		
		$http.post($cookies.get('hostname') + '/PAMS_api/booking/listscheduletimeofroom', reqData)
		.success(function (respData, status, headers, config) {
			callback(respData);
		})
		.error(function(respData, status, headers, config) {
		});
	};
	return service;
}]);