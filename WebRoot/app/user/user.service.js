angular
.module('PAMSapp')

.factory('UserService', 
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
	
	service.GetOrgTreeApi=function(reqData, callback){
        $http.post($cookies.get('hostname')+'/PAMS_api/org/getorgtree', reqData)
            .success(function (respData, status, headers, config) {
                callback(respData);
            })
            .error(function(respData, status, headers, config) {
            	alert("getorgtree error:"+respData);
            });
    }   
    
	service.UpdateUserApi=function(reqData, callback){
		//alert("UpdateUserApi");
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/updateuser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	service.CreateUserApi=function(reqData, callback){
		//alert("CreateUserApi");
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/createuser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	
	service.DeleteUserApi=function(reqData, callback){
		//alert("DeleteUserApi");
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/deleteuser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	
    service.ListUserApi =function(reqData, callback){
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/listuser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	service.RemoveProgFromUserApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/removeprogfromuser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	service.AddProgToUserApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/addprogtouser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	service.AddClassToUserApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/addclasstouser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }
	service.RemoveClassFromUserApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/removeclassfromuser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }	
	service.RemoveTypeFromUserApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/removetypefromuser', reqData)
        	.success(function (respData, status, headers, config) {
        		callback(respData);
        	})
            .error(function(respData, status, headers, config) {
            });
    }	
    service.AddType2UserApi =function(reqData, callback){
		
    	$http.post($cookies.get('hostname')+'/PAMS_api/user/addtypetouser', reqData)
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
	service.ListOrgClassApi=function(reqData, callback){
		 $http.post($cookies.get('hostname')+'/PAMS_api/org/listorgclass', reqData)
		 .success(function (respData, status, headers, config) {
           callback(respData);
		 })
		 .error(function(respData, status, headers, config) {
		 });
   }

   service.ListProgClassApi=function(reqData, callback){
		 $http.post($cookies.get('hostname')+'/PAMS_api/prog/listprogclass', reqData)
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
	return service;
}]);