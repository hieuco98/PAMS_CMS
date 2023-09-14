angular
.module('PAMSapp')
.controller('DeviceController', 
['$rootScope', '$scope', '$window', '$interval', '$location', '$filter', 'DeviceService', 'NgTableParams','$cookies',
 function ($rootScope, $scope, $window, $interval, $location, $filter, DeviceService, NgTableParams,$cookies) {
	$scope.currentDeviceId=-1;
	$scope.isDeviceSelected=false;
	
	$scope.modelDeviceSelected =[];	
	$scope.isCreateNewDevice=false;
	$scope.ListState =[
		{
		id:1,
		name:"Đang hoạt động"
	},
	{
		id:2,
		name:"Bị hỏng"
	},
	{
		id:3,
		name:"Dừng hoạt động"
	},
	{
		id:4,
		name:"Đang sửa"
	},
]
	//$scope.isCreateNewChecklist=false;
	
	//-----------Control user list table-----------	
    $scope.tableDisplayDevice = [];
    $scope.tableDataDevice = [];
    $scope.tableParamsDevice = new NgTableParams({
    	page: 1, 
        count: 5, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.tableDataDevice.length, 
        getData: function($defer,params) {
        	if($scope.tableDataDevice != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tableDataDevice), params.filter()) : 
        			$scope.tableDataDevice;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tableDataDevice;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayDevice = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });
	$scope.optionMessage=[];
	
	(function initController() {
		console.log("Device initController");
		fnListIoTBoard();
		listClassRoom()
		listWorker()
		//fnListBoardDevice();
	})();
	//=======================================================================
	function fnListIoTBoard(){
		var reqData = {};	
		reqData.session_id = $cookies.get('session_id'); 	
		
		DeviceService.ListIoTBoardApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				$scope.tableDataDevice = respData.list_device;
                if($scope.tableDataDevice.length > 0){
	    			$scope.modelDeviceSelected = $scope.tableDataDevice[0];	   			
	    			$scope.clickDeviceSelected($scope.modelDeviceSelected);
                }
                $scope.tableParamsDevice.reload();
				
			
	    	}  else{
	    		alert("Lỗi server!");
			} 
	    });
		
	}	
	//-------------------------------------------------------------------------------
	// function fnListBoardDevice(){
	// 	var reqData = {};	
	// 	reqData.session_id = $cookies.get('session_id'); 	
	// 	reqData.board_code="B00001";
	// 	reqData.board_id=1;
		
	// 	DeviceService.ListBoardDeviceApi(reqData, function (respData) {
	// 		console.log(respData);
	// 		if(respData.code == 200 ) {
	// 			//console.log(respData.message_list);
				
			
	//     	}  else{
	//     		alert("Lỗi server!");
	// 		} 
	//     });
		
	// }	
	// function fnListProcess(){
	// 	var reqData = {};
	// 	reqData.session_id = $cookies.get("session_id");
	// 	$scope.isCreateNewProcess=false;
		
	// 	ProcessService.ListProcessApi(reqData, function (respData) {
	// 		console.log(respData)
	// 		if(respData.code == 200){
	// 			$scope.tableDataProcess = respData.list_process;
    //             if($scope.tableDataProcess.length > 0){
	//     			$scope.modelProcessSelected = $scope.tableDataProcess[0];	   			
	//     			$scope.clickProcessSelected($scope.modelProcessSelected);
    //             }
    //             $scope.tableParamsProcess.reload();
				
	//     	}  else{
	//     		alert("Lỗi server");
	// 		} 
	//     });
	// }
    //--------------------------------------------------------------------------
    // $scope.clickProcessSelected= function (Process_zone){
    // 	console.log("currentUserId:"+$scope.currentProcessId);
    	
    // 	if($scope.currentProcessId == Process_zone.ID){
	// 		$scope.isProcessSelected = false;			
	// 		$scope.currentProcessId = -1;
	// 	}else{
			
	// 		$scope.currentProcessId = Process_zone.ID;
	// 		$scope.isProcessSelected = true;	
			
	// 		$scope.modelProcessSelected = Process_zone;	
	// 		$scope.isCreateNewProcess=false;
	// 		var reqData = {};
	// 		reqData.session_id = $cookies.get('session_id'); 
	// 		reqData.process_id = Process_zone.ID
	// 		ProcessService.ListChecklistApi(reqData, function (respData) {
	// 			if(respData.code == 200){
	// 				//alert("Thành công");

	// 				$scope.listCheckList = respData.list_checklist
	// 			}  else{
	// 				alert("Lỗi");
	// 			} 
	// 		});
			
	// 	}
	// };
	function listClassRoom(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		//reqData.user_type_id = $cookies.get('user_type_id');
		 //TODO
		console.log(reqData);
		DeviceService.GetListClassRoomApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.ListClassroom = respData.list_class;
				$scope.mSelectedClass = $scope.ListClassroom[0];
				//listFloor($scope.mSelectedBuild.id)
				// fnChangeRootProg($scope.modelProgSelected);
			}else if(respData.code == 700){
				Swal.fire({
					type: 'error',
					title: 'Phiên đăng nhập của bạn đã kết thúc.',
					text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
				})
				$location.path('/login');
			}else{
				Swal.fire({
					type: 'error',
					title: 'Đã có lỗi xảy ra',
					text: 'Lỗi GetAreaByParentApi! '+ respData.description
				})
			}
		});
	}
	function listWorker(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		//reqData.user_type_id = $cookies.get('user_type_id');
		 //TODO
		console.log(reqData);
		DeviceService.GetListWorkerApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.ListWorker = respData.list_user;
				$scope.mSelectedWorker = $scope.ListWorker[0];
				//listFloor($scope.mSelectedBuild.id)
				// fnChangeRootProg($scope.modelProgSelected);
			}else if(respData.code == 700){
				Swal.fire({
					type: 'error',
					title: 'Phiên đăng nhập của bạn đã kết thúc.',
					text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
				})
				$location.path('/login');
			}else{
				Swal.fire({
					type: 'error',
					title: 'Đã có lỗi xảy ra',
					text: 'Lỗi GetAreaByParentApi! '+ respData.description
				})
			}
		});
	}
	$scope.ChangeClass = function(class_info)
	{
		//listFloor(buildinginfo.id)
		$scope.mSelectedClass =class_info;
	}
	$scope.ChangeFloor = function(floorinfo)
	{
		listRoom(floorinfo.id)
		$scope.mSelectedFloor =floorinfo;
	}
	$scope.clickDeviceSelected= function (QueenBee_zone){
    	console.log("currentUserId:"+$scope.currentDeviceId);
    	
    	if($scope.currentDeviceId == QueenBee_zone.id){
			$scope.isDeviceSelected = false;			
			$scope.currentDeviceId = -1;
		}else{
			
			$scope.currentDeviceId = QueenBee_zone.id;
			$scope.isDeviceSelected = true;	
			$scope.modelDeviceSelected = QueenBee_zone;	
			$scope.isCreateNewDevice=false;
			
		}
	};
	 //--------------------------------------------------------------------------
	$scope.clickAddNewDevice=function(){
		$scope.isCreateNewDevice = !$scope.isCreateNewDevice;
  		if($scope.isCreateNewDevice==true) {
  			$scope.isDeviceSelected = false;			
			$scope.currentDeviceId = -1;
  		}
  		
	}
	$scope.updateDevice=async function(modelDeviceName,DeviceClass,modelDeviceProjectSource,DeviceState){
    	var reqData = {};
		if (!confirm("Bạn chắc chắn muốn cập nhật ?")){return;}

    	// console.log($scope.vm.listjob)
    	// if(user_role!=undefined){
    	// 	reqData.role=user_role.type;
    	// }
		//var list_job_new =Object.entries($scope.vm.listjob).map(item => (item[1]))
		// for(i=0;i<$scope.vm.listjob.length;i++)
		// {
		// 	await list_job_new.push($scope.vm.listjob.i)
		// }
		
		// console.log(list_job_new)
		reqData.session_id = $cookies.get('session_id'); 
		reqData.device_id = $scope.modelDeviceSelected.id;
        // reqData.process_name = $scope.modelProcessSelected.Name;
		// reqData.order_id = modelProcessOrder
		// reqData.time_duration = 1
		// reqData.time_unit = 'Month'
        //reqData.Process_type_desc = modelProcessDescription
		reqData.device_name = modelDeviceName
		if(reqData.device_name == null)
		{
			reqData.device_name = $scope.modelDeviceSelected.device_name
		}

		reqData.project_source = modelDeviceProjectSource
		if(reqData.project_source== null)
		{
			reqData.project_source = $scope.modelDeviceSelected.project_source
		}
		
		if(DeviceState== null)
		{
			reqData.state = $scope.modelDeviceSelected.state_id
		}
		else
		{
			reqData.state = DeviceState.id
		}
		
		if(DeviceClass== null)
		{
			reqData.campus_area_id = $scope.modelDeviceSelected.class_id
		}
		else
		{
			reqData.campus_area_id = DeviceClass.id
		}
		DeviceService.UpdateDeviceApi(reqData, function (respData) {
			if(respData.code == 200){
				fnListIoTBoard();
				alert("Cập nhật thành công")
	    	}  else{
	    		alert("Lỗi server:"+respData.desc);
			} 
	    });
    }
	$scope.addDevice=function(){
		var reqData = {};
	  reqData.session_id = $cookies.get('session_id'); 
	  
	  // reqData.full_name = $scope.userFullname;
	  // if(reqData.full_name==null) {alert("Chưa có full_name ");return}
	  
	  
	  reqData.device_name = $scope.DeviceName;
	  if(reqData.device_name==null) {alert("Chưa có Tên thiết bị");return}
	  reqData.project_source = $scope.DeviceProjectSource;
	  if(reqData.project_source==null) {
		reqData.project_source =''
	  }
	  if($scope.mSelectedClass != null)
	  {
		reqData.campus_area_id = $scope.mSelectedClass.id;
	  }
	  reqData.state =1 
	  if($scope.mSelectWorker != null)
	  {
		reqData.owner_by = $scope.mSelectWorker.id;
	  }
	  reqData.date = $scope.DeviceStartUsing;
	  if(reqData.date==null) {alert("Chưa chọn ngày sử dụng thiết bị");return}
	//  if(reqData.campus_area_id==null) {alert("Chưa gán thiết bị vào phòng");return}
	
	  
	  // reqData.type=$scope.selectedUserType.type;
  
		  DeviceService.CreateDeviceApi(reqData, function (respData) {
		  if(respData.code == 200){
			  alert("Thành công");
			 fnListIoTBoard()
		  }  else{
			  alert("Lỗi");
		  } 
	  });
		
		
	}
	$scope.clickDeleteDevice = function(device_id) {
    	var reqData = {};
    	if (!confirm("Bạn chắc chắn muốn xóa?")) {return;}
    	//console.log(process_id)
    	reqData.session_id = $cookies.get('session_id'); 
		reqData.device_id = device_id;
		DeviceService.DeleteDeviceApi(reqData, function (respData) {
			if(respData.code == 200){
				fnListIoTBoard();
	    	}  else{
	    		alert("Lỗi server:"+respData);
			} 
	    });
  
    };
	
}]);