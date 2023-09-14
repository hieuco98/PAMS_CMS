angular
.module('PAMSapp')
.controller('areaController', 
['$rootScope', '$scope', '$window', '$interval', '$location', '$filter', 'areaService', 'NgTableParams','$cookies',
 function ($rootScope, $scope, $window, $interval, $location, $filter, areaService, NgTableParams,$cookies) {
	
	
	//-----------CSVC table----------	
    $scope.tableDisplayCsvcData = [];
    $scope.tableDataCsvcData = [];
    $scope.tableParamsCsvcData = new NgTableParams({
    	page: 1, 
        count: 25, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.tableDataCsvcData.length, 
        getData: function($defer,params) {
        	if($scope.tableDataCsvcData != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tableDataCsvcData), params.filter()) : 
        			$scope.tableDataCsvcData;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tableDataCsvcData;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayCsvcData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    }); 
	
	//--------Campus0-----------------
    
    $scope.treeCampusAreaData = [];
	$scope.treeCampusAreaControl = {};
	$scope.treeCampusAreaHandler = fnTreeCampusAreaHandler;
	$scope.treeCampusAreaSelected = {};

	$scope.disabledAddRoot = true;
	$scope.disabledAddBranch = true;
	$scope.isUpdateSelected = false;
	$scope.campusareaSelected = false;
	
	
	//$scope.isCreateNewCampusArea=false;
	$scope.choiceClassRoomMode = 0;

	//-----------------------------------------
	$scope.currentBookingOrderId=-1;
	$scope.isBookingOrderSelected=false;
	$scope.modelBookingOrderSelected =[];	

	//-----------Booking list table-----------	
    $scope.tableDisplayBookingOrder = [];
    $scope.tableDataBookingOrder = [];
    $scope.tableParamsBookingOrder = new NgTableParams({
    	page: 1, 
        count: 5, 
        sorting: {},
        filter:{}
    }, {
        total: $scope.tableDataBookingOrder.length, 
        getData: function($defer,params) {
        	if($scope.tableDataBookingOrder != true){
        		var filteredData = params.filter() ? 
        			$filter('filter')(($scope.tableDataBookingOrder), params.filter()) : 
        			$scope.tableDataBookingOrder;
        		var orderedData = params.sorting() ? 
        			$filter('orderBy')(filteredData, params.orderBy()) : 
        			$scope.tableDataBookingOrder;
        		params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplayBookingOrder = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });
	
    //----------------------------------------------------------------------------
    $rootScope.calendarEl =null;
	$scope.vm=undefined;
	//-----------------------------------------------------------------------------
	(function initController() {
		fnGetCampusAreaTree();
		// fnListCampusType();
		// fnListCampusOwnerType();
		// fnListBookingState();
		
		
		$rootScope.calendarEl = document.getElementById('t_calendar');
		console.log("............");
		loadCalendar($scope.tt_data, $scope.ext_data);
		
		console.log($rootScope.calendarEl);
		
    })();
	//============================================================

    //---------------------------------------------------------
	$scope.checkOptionBookingEnabled = function(optionEnabled){
    	console.log(optionEnabled);
    }
	//-------------------------------------------------------------   
    $scope.updateBookingOption=function (campus_area_id,new_option){
    	var req= {};
		req.session_id =$cookies.get("session_id");
		
		req.campus_area_id=campus_area_id;
		req.is_booking_enabled=new_option;
		
		areaService.updateBookingEnabledOptionApi(req, function(respData){
			console.log(respData);
			if(respData.code == 200 ) {
				alert("Thành công");
			}  else{
	    		alert("updateBookingOption: Lỗi server!");
			} 
			
		});
    }
	//-------------------------------------------------------------
	function fnListBookingOrder(campus_area_id){
		var req= {};
		req.session_id =$cookies.get("session_id");
		req.campus_area_id=campus_area_id;
		
		areaService.listBookingOrderApi(req, function(respData){
			console.log(respData);
			if(respData.code == 200 ) {
				$scope.tableDataBookingOrder= respData.booking_order_list;
				$scope.tableParamsBookingOrder.reload();
			}  else{
	    		alert("listBookingOrderApi: Lỗi server!");
			} 
			
		});
	}
	//--------------------------------------------------------------------------
	function fnRoomConflictCheck(booking_order){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.booking_order_id=booking_order.id;
		areaService.RoomConflictCheckApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				$scope.result_check=respData.result_check;
	    	}  else{
	    		alert("RoomConflictCheckApi: Lỗi server!");
			} 
	    });
	}
	//--------------------------------------------------------------------------
    $scope.clickBookingOrderSelected= function (booking_order){
    	console.log("currentBookingOrderId:"+$scope.currentBookingOrderId);
    	
    	if($scope.currentBookingOrderId == booking_order.id){
			$scope.isBookingOrderSelected = false;			
			$scope.currentBookingOrderId = -1;
		}else{
			
			$scope.currentBookingOrderId = booking_order.id;
			$scope.isBookingOrderSelected = true;	
			
			$scope.modelBookingOrderSelected = booking_order;	
			
			fnRoomConflictCheck(booking_order);
			
		}
	};
	//-------------------------------------------------------------
	function fnListCampusType(){
		var reqData = {};
		areaService.ListLoaiCampusAreaApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				$scope.optionCampusType=respData.campus_type_list;
	    	}  else{
	    		alert("ListLoaiCampusAreaApi: Lỗi server!");
			} 
	    });
	}
	//---------------------------------------------------------------------------------------
	function fnListCampusOwnerType(){
		var reqData = {};
		areaService.ListOwnerTypeApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				$scope.optionCampusOwnerType=respData.campus_ownertype_list;
	    	}  else{
	    		alert("ListOwnerTypeApi: Lỗi server!");
			} 
	    });
	}
	function fnListBookingState(){
		var reqData = {};
		areaService.ListBookingStateApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				$scope.optionBookingState=respData.booking_state_list;
	    	}  else{
	    		alert("ListBookingStateApi: Lỗi server!");
			} 
	    });
	}

	//-------------------------------------------------------------------------
	$scope.RadioChange = function (s) {
		$scope.choiceClassRoomMode=s;
    	console.log($scope.choiceClassRoomMode);
    	
    };
	//---------------------------------------------------------------------------------------------------------
	do_timeout = function(){
		//$scope.treeCampusAreaControl.expand_all();
		fnTreeCampusAreaHandler($scope.treeCampusAreaControl.select_first_branch());
		
	};
	//---------------------------------------------------------------------------------------------------------
	function fnGetCampusAreaTree(){
		$scope.loading1 = true;
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.flag_checkpoint=1;//
		
		areaService.GetCampusAreaTreeApi(reqData, function (respData) {
            console.log(respData)
    		if (respData.code == 200) {
    			$scope.loading1 = false;
    			if(!respData.campus_area_tree.length){
    				alert('Chưa có dữ liệu');
    			}else{
    				
    				console.log(respData);
    				$scope.campus_area_root_name=respData.parent_campus_area_name;
 					$scope.treeCampusAreaData = respData.campus_area_tree;
 					
 					
 					setTimeout(do_timeout, 500);
    			}
    		}
    	});
	}	    
    
    //-----------------------------------------------------------------------
	function fnTreeCampusAreaHandler(branch){

		if(branch==undefined){
			alert("???"); return;
		}
		$scope.disabledAddBranch = false;
		$scope.isUpdateSelected = true;
		$scope.treeCampusAreaSelected = branch;
		$scope.campusareaSelected = true;
		
			
		$scope.campusareaName=branch.label;
		$scope.campusareaUrl=branch.url;
		$scope.campusareaLogo=branch.logo;
	
		console.log("choiceClassRoomMode:"+$scope.choiceClassRoomMode);

		console.log($scope.treeCampusAreaSelected);
		
		fnListBookingOrder($scope.treeCampusAreaSelected.id);
		
		if($scope.treeCampusAreaSelected.loai==13){ //phòng học
			fnListTimeScheduleOfRoom($scope.treeCampusAreaSelected);
		}
	}
	//-------------------------------------------------------------------------
	function fnListTimeScheduleOfRoom(campus_area){
		//var reqData = {};
		
		reqData.session_id =$cookies.get("session_id");
		//reqData.building_code="";//"A2";
		console.log(campus_area);
		//alert("ds");
		
		
		reqData.campus_area_id=campus_area.id;
		reqData.room_code=campus_area.label;//"104";
		
		console.log(reqData);
		
		areaService.ListTimeScheduleOfRoomApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				$scope.optionRoomSchedule=respData.schedule_list;
				$scope.tt_data=respData.schedule_list;
				$scope.ext_data=respData.extra_schedule_list;
				console.log($scope.tt_data);
				console.log($scope.ext_data);
				loadCalendar($scope.tt_data, $scope.ext_data);
	    	}  else{
	    		alert("ListTimeScheduleOfRoomApi: Lỗi server!");
			} 
	    });
	}
	//---------------------------------------------------------
	$scope.ext_data = [
		{
			title: 'KTAT - Kiểm tra cuối kỳ',
			start: '2023-03-04T10:30:00',
			end: '2023-03-04T12:30:00', 
			type: 'extra'
		},{
		
			title: 'Kỹ năng mềm - Kiểm tra cuối kỳ',
			start: '2023-03-25T10:30:00',
			end: '2023-03-25T12:30:00', 
			type: 'extra'
		}
	];

	$scope.tt_data = [
		{
			title: 'Kỹ thuật âm thanh',
			start: '2023-03-12T10:30:00',
			end: '2023-03-12T12:30:00', 
			type: 'timetable'
		},{
			title: 'An toàn thông tin',
			start: '2023-03-15T10:30:00',
			end: '2023-03-15T12:30:00', 
			type: 'timetable'
		}
	];


	lessonPeriods = [
		{
			"id": 1,
			"name": "Kíp 1",
			"start": "07:30",
			"end": "09:20"
		},{
			"id": 2,
			"name": "Kíp 2",
			"start": "09:30",
			"end": "11:20"
		},{
			"id": 3,
			"name": "Kíp 3",
			"start": "12:30",
			"end": "14:20"
		},{
			"id": 4,
			"name": "Kíp 4",
			"start": "14:30",
			"end": "16:20"
		},{
			"id": 5,
			"name": "Kíp 5",
			"start": "16:30",
			"end": "18:20"
		},{
			"id": 6,
			"name": "Kíp 6",
			"start": "19:30",
			"end": "21:20"
		}
	];
	//-----------------------------------------------------------------------------------
	$scope.time_range=undefined;
	//------------------------------------------------------------------------------------
	function loadCalendar(){
		
		console.log('calendar is loading....');
		if($rootScope.calendarEl==undefined){
			$rootScope.calendarEl = document.getElementById('t_calendar');
		}
		
		console.log($scope.tt_data);
		
		var calendar = new FullCalendar.Calendar($rootScope.calendarEl, {
			// nextDayThreshold: '00:00:00',
			initialView: 'dayGridMonth',
			nowIndicator: true,
			defaultDate: new Date(),
			//initialDate: today,
			// initialDate: '2022-08-07',
			headerToolbar: {
				left: 'prev,next today',
				// center: 'title addEventButton',
				center: 'title',
				right: 'dayGridMonth,timeGridWeek,timeGridDay,agendaDay,listWeek'
			},
			
			
			locale:'vi',
			minTime: '07:00',
			maxTime: '22:00',
			scrollTime: '10:00',
			slotDuration: '00:15:00',
			slotLabelInterval: '00:15:00',
			
			slotLabelFormat: function (date)
			{
				for(var i=0; i<lessonPeriods.length; i++){
					let periodStart = lessonPeriods[i].start.split(":");
					let startHour = periodStart[0];
					if(date.date.hour==parseInt(periodStart[0])&&date.date.minute==parseInt(periodStart[1])){
						return lessonPeriods[i].name;break;
					}
				}
				return '';
			},
			eventSources: [
			    {
			        events: $scope.tt_data,
			        color: 'yellow',
			        textColor: 'black'
			    },
			    {
			        events: $scope.ext_data,
			        color: 'green',
			        textColor: 'blue'
			    }
		    ],
			eventClick: function(info) {

				console.log(info.event.start);
				console.log(info.event.end);
				
				$scope.selectedDate = info.event.start;
				
				$scope.s_date = info.event.start.toISOString().split('T')[0];
				$scope.e_date = info.event.end.toISOString().split('T')[0];
				
				
				console.log($scope.s_date);
				console.log($scope.e_date);
				
				info.jsEvent.preventDefault(); // don't let the browser navigate
			    let type = info.event.extendedProps.type;
			    
			    console.log(info.event.extendedProps);
			    

			    if(type=='timetable'){
			    	alert("timetable event:"+info.event.start+"---"+info.event.end);
			    	/*fnGetRootProgs();
			    	$("#create_quiz_session").modal({
			            backdrop: 'static',
			            keyboard: true, 
			            show: true
					});*/
			    }else if(type=='extra'){
			    	alert("extra event:"+info.event.start+"---"+info.event.end);
			    	
			    }
			},
			select: 
				function(range){ 
					console.log(range); 
					$scope.time_range=range;
					$scope.startStr = range.startStr;
					var dStart = range.start;

					$scope.selectedDate = dStart;
					console.log($scope.selectedDate);
				
					setTimeout(function(){
						$scope.$apply(function(){
							$scope.modelTimeStart=$scope.time_range.start;
							//document.getElementById("time_start").innerHTML =$scope.time_range.start;
							
							$scope.modelTimeEnd=$scope.time_range.end;
							//document.getElementById("time_end").innerHTML =$scope.time_range.end;
						});
					});
					
					$("#modalBooking").modal({
				        backdrop: 'static',
				        keyboard: true, 
				        show: true,
				        height: 'auto',
				        width: 'auto'/*,
				        'max-height':'100%',
				        'max-width':'100%'*/
					});
					
				},
				selectable:true,
				editable: true,
				//addEvent( event ),
				/*eventDrop: function(info) {
				    alert(info.event.title + " được chuyển sang " + info.event.start.toISOString());
				    if (!confirm("Xác nhận thay đổi?")) {
				      info.revert();
				    }
				}*/
		});
		calendar.render();

	}
    //---------------------------------------------------------------------------------------------
    $scope.updateCampusArea=function(name, url, logo, code, objectid,size, usagetype,ownertype,role){
    	alert("Lệnh không sẵn sàng");
  
    }
  //---------------------------------------------------------------------------------------------
    $scope.updateBookingOrder=function(order,new_state, reason){
    	
    	var reqData = {};
		if (!confirm("Bạn chắc chắn muốn cập nhật?")) {return;}

		reqData.session_id = $cookies.get('session_id'); 
		
    	console.log(order);
    	console.log(new_state);
    	
    	if(new_state==undefined || new_state.id==order.state){
    		alert("Chưa chọn trạng thái mới");
    		return;
    	}
    	
    	
		reqData.booking_id = order.id;
		reqData.new_state=new_state.id;
		if(reason!=undefined)reqData.reason=reason;
		
		areaService.UpdateBookingOrderApi(reqData, function (respData) {
			if(respData.code == 200){
				fnListBookingOrder($scope.treeCampusAreaSelected.id);
				alert("Thành công");
	    	}  else{
	    		alert("UpdateBookingOrderApi Lỗi server:"+respData);
			} 
	    });
    }
	
}]);