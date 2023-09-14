angular
.module('PAMSapp')

.factory('DeviceService', 
		['$http', '$cookies', 
		 function($http, $cookies){
	
	var service = {};
	
	service.ListIoTBoardApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/device/listdevice', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            });
    }
    service.CreateDeviceApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/device/adddevice', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            });
    }
	service.UpdateDeviceApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/device/updateDevice', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            });
    }
    service.DeleteDeviceApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/device/deletedevice', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            });
    }
    service.GetListClassRoomApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/campusarea/listclassroom', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            });
    }
    service.GetListWorkerApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/user/listworker', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            });
    }
	return service;
}]);