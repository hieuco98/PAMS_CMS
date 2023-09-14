angular
.module('PAMSapp')
.controller('sbookingController', 
	['$rootScope', '$scope', '$window', '$interval', '$timeout' ,'$location', '$filter', 'sbookingService', 'NgTableParams','$cookies',
	function ($rootScope, $scope, $window, $interval, $timeout, $location, $filter, sbookingService, NgTableParams,$cookies) {


	$rootScope.elem=null ;
	$scope.listClassesTime = [
		1,2,3,4,5,6,7,8,9,10,11,12,13
	]
	var lessonPeriods = [
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

	$scope.campusLocations = [
	{
			"id": 1,
			"name": "Nhà A1"
		},{
			"id": 2,
			"name": "Nhà A2"
		},{
			"id": 3,
			"name": "Nhà A3"
		}
	];
	$scope.mSelectedLoc = $scope.campusLocations[1];

	$scope.roomTypes = [
		{
			"id": 13,
			"name": "Phòng học"
		}
		// ,{
		// 	"id": 14,
		// 	"name": "Phòng sinh hoạt chung"
		// },{
		// 	"id": 11,
		// 	"name": "Hội trường"
		// },{
		// 	"id": 19,
		// 	"name": "Phòng tự học CLC"
		// },
		// {
		// 	"id": 23,
		// 	"name": "Phòng thư viện"
		// },
		// {
		// 	"id": 7,
		// 	"name": "Phòng thí nghiệm thực hành"
		// }
	];
	$scope.mSelectedRoomTye = $scope.roomTypes[0];

	$scope.roomCapacities = [
		{
			"id": 0,
			"name": "Tất cả"
		},{
			"id": 1,
			"name": "0-15"
		},{
			"id": 2,
			"name": "30"
		},{
			"id": 3,
			"name": "50"
		},{
			"id": 4,
			"name": "75"
		},{
			"id": 5,
			"name": ">100"
		}
	];	
	$scope.mSelectedCap = $scope.roomCapacities[0];
			

	//=============================================================================
	(function initController() {
		// listQuizSession();
		// f1();
		listCampusArea(3);//default for CS1 HD
		// loadCalendar();

		listRoom(116);
	})();

	function listCampusArea(area_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.user_type_id = $cookies.get('user_type_id');
		reqData.area_id = area_id; //TODO
		console.log(reqData);
		sbookingService.GetAreaByParentApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.campusLocations = respData.campus_area_list;
				$scope.mSelectedLoc = $scope.campusLocations[0];

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

	function listRoom(area_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.user_type_id = $cookies.get('user_type_id');
		reqData.area_id = area_id;
		console.log(reqData);
		sbookingService.GetAreaByParentApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.roomLists=[];
				if(respData.campus_area_list.length==0){
					$scope.roomLists=[];
				}else{
					respData.campus_area_list.forEach(e =>{
						let r= {};
						r.id = e.id;
						r.title = e.name;
						$scope.roomLists.push(r);
					})
				}
				if($scope.roomLists!=undefined&&$scope.roomLists.length>0){
					console.log($scope.roomLists);
					loadCalendar();
				}
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


	function loadCalendar(){
		var calendarEl = document.getElementById('s_calendar');

		var calendar = new FullCalendar.Calendar(calendarEl, {
			schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
			// nextDayThreshold: '00:00:00',
			initialView: 'resourceTimelineDay',
			// initialView: 'dayGridMonth',
			nowIndicator: true,
			defaultDate: new Date(),

			// initialDate: today,
			// initialDate: '2022-08-07',
			height: "auto",
			headerToolbar: {
				left: 'prev,next today',
				// center: 'title addEventButton',
				center: 'title',
				right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
				// right: 'dayGridMonth,timeGridWeek,timeGridDay,agendaDay,listWeek'
			},
			views: {
			    timeGridDay: { // name of view
			    	// titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
			      	// other view-specific options here
			    	minTime: '09:00:00',
			    	maxTime: '22:00:00'
			    }
			},
			businessHours: {
			  // days of week. an array of zero-based day of week integers (0=Sunday)
			  daysOfWeek: [ 1, 2, 3, 4, 5], // Monday - Thursday

			  startTime: '06:00', // a start time (10am in this example)
			  endTime: '20:00', // an end time (6pm in this example)
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

			    /*if ((date.date.hour>7&&date.date.hour<22) && date.date.minute == 30)
			        return 'Tiết '+(date.date.hour-7).toString();*/
			        // return date.date.hour.toString().padStart(2, '0') + ':00';

			    return '';
			    // return date.date.minute;
			},

			editable: true,
          	resourceAreaHeaderContent: 'Phòng',
          	resources: $scope.roomLists,
          	// resources: 'https://fullcalendar.io/api/demo-feeds/resources.json?with-nesting&with-colors',
          	events: 'https://fullcalendar.io/api/demo-feeds/events.json?single-day&for-resource-timeline',

			eventSources: [
			    {
			        events: $scope.tt_data,
			        color: 'yellow',
			        textColor: 'black'
			    },
			    {
			        // events: $scope.quiz_data,
			        events: $scope.tableDataQuizSession,
			        color: 'blue',
			        textColor: 'white'
			    }
		    ],
			eventClick: function(info) {

				//reset student list
				$scope.tableDataStudent = [];
    			$scope.tableParamsStudent.reload();

				console.log(info.event);
				console.log(info.title);
				console.log(info.event.start);
				$scope.selectedDate = info.event.start;
				// $scope.s_date = $scope.selectedDate.toISOString().split('T')[0];
				$scope.s_date = info.event.start.toISOString().split('T')[0];
				console.log($scope.s_date);
			    info.jsEvent.preventDefault(); // don't let the browser navigate
			    let type = info.event.extendedProps.type;
			    console.log(info.event.extendedProps)
			    $scope.quizTitle = info.event.extendedProps.prog_code + '--' + info.event.extendedProps.quizsession_title;
			    console.log($scope.quizTitle);
			    console.log(type)
			    $scope.quizSession = info.event.extendedProps;
			    console.log($scope.quizSession);
			    console.log($scope.quizSession.prog_name);
			    console.log($scope.quizSession.template_name);
			},
			select: 
				function(start,end){ 
					// fnGetRootProgs();
					console.log('is it??????');
					console.log(start); 
					console.log(start.start);

					console.log(end); 

					$("#abc").modal({
								backdrop: 'static',
								keyboard: true, 
								show: true
							});

					/*console.log(start.start.toISOString());
					console.log(start.startStr);
					$scope.startStr = start.startStr;
					var dStart = start.start;

					$scope.selectedDate = dStart;
					$scope.s_date = toISOLocal(dStart);
					console.log($scope.selectedDate);
					console.log($scope.s_date);
			          // var selDate = new Date(start);
			          // add your function
					if($scope.selectedDate!=undefined){
						if(start.start.setHours(23, 59, 59, 999)>=Date.now()) {
							$("#create_quiz_session").modal({
								backdrop: 'static',
								keyboard: true, 
								show: true
							});
						}else{
							Swal.fire({
								type: 'warning',
								title: 'Không tạo được ca thi vào ngày đã chọn',
								text: 'Không tạo được ca thi vào khoảng thời gian đã xảy ra'
							});
							return;
						}
						
					}*/
				},
			selectable:true,
			editable: true,
			// addEvent( event ),
			eventDrop: function(info) {
			    alert(info.event.title + " được chuyển sang " + info.event.start.toISOString());
			    if (!confirm("Xác nhận thay đổi?")) {
			      info.revert();
			    }
			}
		});

		calendar.render();

	}
	$scope.getAvailableRooms=function(building,type,date,start_period,end_period){
    	var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		console.log(date)
		date = date.toISOString()
		date = date.split("T")[0]
        var date_split = date.split("-")
        var day = parseInt(date_split[2])+1
        var month =parseInt(date_split[1])
        var year = date_split[0]
		var date_select = day + "/" + month + "/" + year
        // year = year.slice(2,4)
        // year = parseInt(year)
		reqData.date=date_select;
		$scope.select_date = date_select
		console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTT",date_select)
		if(building==undefined){
			alert("Chưa chọn tòa nhà"); return;
		}
		else{
			reqData.building=building.name;
		}
		if(type==undefined){
			alert("Chưa chọn loại phòng học"); return;
		}
		else{
			reqData.type=type.id;
		}
		
		
		if(start_period==undefined){
			alert("Chưa chọn kíp bắt đầu"); return;
		}
		else{
			reqData.starting_block=start_period;
			$scope.selected_start_period=start_period;
		}
	
		
		if(end_period==undefined){
			alert("Chưa chọn kíp kết thúc"); return;
		}
		else
		{
			reqData.ending_block=end_period;
			$scope.selected_end_period=end_period;
		}
		console.log(reqData);
		sbookingService.GetAvailableRoomsApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
				$scope.optionAvailableRooms= respData.available_room_list;
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
    }
	$scope.clickBookRoom=function(room){
    	$scope.selected_room=room;
    	
    	$("#modalBooking").modal({
	        backdrop: 'static',
	        keyboard: true, 
	        show: true,
	        height: 'auto',
	        width: 'auto'/*,
	        'max-height':'100%',
	        'max-width':'100%'*/
		});
    }
	$scope.clickSubmitBooking = function(selected_room_id,selected_start_period,selected_end_period,modeBookingReason)
	{
		var reqData = {};
		reqData.session_id = $cookies.get("session_id");
		// console.log(date)
		// date = date.toISOString()
		// date = date.split("T")[0]
        // var date_split = date.split("-")
        // var day = parseInt(date_split[2])+1
        // var month =parseInt(date_split[1])
        // var year = date_split[0]
		// var date_select = day + "/" + month + "/" + year
        // year = year.slice(2,4)
        // year = parseInt(year)
		// reqData.date=date_select;
		// $scope.select
		// console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTT",date_select)
		
			reqData.campus_area_id=selected_room_id;
			reqData.date = $scope.select_date
		if(modeBookingReason==undefined){
			alert("Chưa nhập lý do mượn phòng"); return;
		}
		else{
			reqData.reason=modeBookingReason;
		}
			reqData.starting_block=selected_start_period
			reqData.ending_block=selected_end_period;
		
		console.log(reqData);
		sbookingService.CreateBookingOrderApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200){
			alert("Đặt phòng thành công")
				
	    	}  else{
	    		alert("Lỗi server");
			} 
	    });
	}
}]);