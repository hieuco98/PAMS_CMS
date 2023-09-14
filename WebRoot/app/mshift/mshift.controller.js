angular
.module('PAMSapp')
.controller('mshiftController', 
['$rootScope', '$scope', '$window', '$interval', '$location', '$filter', 'mshiftService', 'NgTableParams','$cookies',
	function ($rootScope, $scope, $window, $interval, $location, $filter, mshiftService, NgTableParams,$cookies) {

	$rootScope.elem=null ;
	
	$scope.shiftPeriods = [
		{
			"id": 1,
			"name": "Ca 1",
			"start": "06:00",
			"end": "14:00"
		},{
			"id": 2,
			"name": "Ca 2",
			"start": "13:30",
			"end": "21:30"
		}
	];
	$scope.listSemester = [
		
			{
				"id": 1,
				"name": "2022-2023"
			},{
				"id": 2,
				"name": "2023-2024"
			}
		
	]
	$scope.danhsachhocki = [
		
		{
			"id": 1,
			"name": "Học kì 1"
		},{
			"id": 2,
			"name": "Học kì 2"
		}
	
]
$scope.listWeek = [
		
	{
		"id": 1,
		"name": " Tuần 1"
	},{
		"id": 2,
		"name": "Tuần 2"
	},
	{
		"id": 3,
		"name": "Tuần 3"
	},{
		"id": 4,
		"name": "Tuần 4"
	},
	{
		"id": 5,
		"name": "Tuần 5"
	},{
		"id": 6,
		"name": "Tuần 6"
	},
	{
		"id": 7,
		"name": "Tuần 7"
	},{
		"id": 8,
		"name": "Tuần 8"
	},
	{
		"id": 9,
		"name": "Tuần 9"
	},{
		"id": 10,
		"name": "Tuần 10"
	},
	{
		"id": 11,
		"name": "Tuần 11"
	},{
		"id": 12,
		"name": "Tuần 12"
	},
	{
		"id": 13,
		"name": "Tuần 13"
	},{
		"id": 14,
		"name": "Tuần 14"
	},
	{
		"id": 15,
		"name": "Tuần 15"
	},{
		"id": 16,
		"name": "Tuần 16"
	},
	{
		"id": 17,
		"name": "Tuần 17"
	},{
		"id": 18,
		"name": "Tuần 18"
	},
	{
		"id": 19,
		"name": "Tuần 19"
	},{
		"id": 20,
		"name": "Tuần 20"
	},

]
$scope.start_week = 1
	// $scope.campusLocations = [
	// 	{
	// 		"id": 0,
	// 		"name": "Tất cả"
	// 	},{
	// 		"id": 1,
	// 		"name": "A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ssssssssssssssssssss"
	// 	},{
	// 		"id": 2,
	// 		"name": "A2"
	// 	},{
	// 		"id": 3,
	// 		"name": "A3"
	// 	}
	// ];
	//$scope.mSelectedLoc = $scope.campusLocations[1];

	$scope.roomTypes = [
		{
			"id": 0,
			"name": "Tất cả"
		},{
			"id": 1,
			"name": "Phòng học"
		},{
			"id": 2,
			"name": "Giảng đường"
		},{
			"id": 3,
			"name": "Hội trường"
		},{
			"id": 4,
			"name": "Ngoài trời"
		}
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
			


	$scope.checkPoints = [
		{
			"id": 1,
			"title": "Điểm KT1"
		},{
			"id": 2,
			"title": "Điểm KT2"
		},{
			"id": 3,
			"title": "Điểm KT3"
		},{
			"id": 4,
			"title": "Điểm KT4"
		},{
			"id": 5,
			"title": "Điểm KT5"
		}
	];

	//=============================================================================
	(function initController() {
		// listQuizSession();
		// f1();
		// listCheckPoints();//default for CS1 HD
		// loadCalendar();
		listSchedule($scope.start_week)
		listBuilding()
		// listRoom(116);
	})();


	$scope.findSchedule = function(modelYearSelected,modelSemesterSelected,modelWeekSelected)
	{
		listSchedule(modelWeekSelected.id)
	}
	function listSchedule(week)
	{
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.week_no = week
		$scope.week_no_select =week
		console.log(reqData);
		mshiftService.GetListScheduleApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.week_detail=respData.week_detail;
				$scope.schedule_detail = respData.schedule
				// if(respData.campus_area_list.length==0){
				// 	$scope.roomLists=[];
				// }else{
				// 	respData.campus_area_list.forEach(e =>{
				// 		let r= {};
				// 		r.id = e.id;
				// 		r.title = e.name;
				// 		$scope.roomLists.push(r);
				// 	})
				// }
				// if($scope.roomLists!=undefined&&$scope.roomLists.length>0){
				// 	console.log($scope.roomLists);
				// 	loadCalendar();
				// }
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
	function listCheckPoints(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.user_type_id = $cookies.get('user_type_id');
		console.log(reqData);
		/*mshiftService.GetAreaByParentApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.campusLocations = respData.campus_area_list;
				$scope.mSelectedLoc = $scope.campusLocations[0];
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
		});*/
	}
	function listBuilding(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		//reqData.user_type_id = $cookies.get('user_type_id');
		 //TODO
		console.log(reqData);
		mshiftService.GetBuildingApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.campusLocations = respData.list_building;
				$scope.mSelectedBuild = $scope.campusLocations[0];
				listFloor($scope.mSelectedBuild.id)
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
	function listFloor(parent_id)
	{
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		
		reqData.parent_id = parent_id
		reqData.type = 5
		mshiftService.GetAreaByParentApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				$scope.floorList = respData.list_area;
				//$scope.mSelectedFloor = $scope.floorList[0];
				// listRoom($scope.mSelectedFloor.id)
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
	$scope.ChangeBuiding = function(buildinginfo)
	{
		listFloor(buildinginfo.id)
		$scope.mSelectedBuild =buildinginfo;
	}
	$scope.ChangeFloor = function(floorinfo)
	{
		// listRoom(floorinfo.id)
		$scope.mSelectedFloor =floorinfo;
	}
	function listRoom(area_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.user_type_id = $cookies.get('user_type_id');
		reqData.area_id = area_id;
		console.log(reqData);
		mshiftService.GetAreaByParentApi(reqData, function (respData) {
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

$scope.updateSchedule = function(date,username,user_id,day_of_week)
{
	$("#abc").modal({
		backdrop: 'static',
		keyboard: true, 
		show: true
	});
	$scope.usernameSelected = username
	$scope.userIDSelected = user_id
	$scope.dateSelected = date
	$scope.dayofweekSelected =  day_of_week
	
}

$scope.createSchedule = function()
{
	var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		if($scope.mSelectedFloor == null)
		{
			reqData.campus_area_id =$scope.mSelectedBuild.id
		}
		else{
			reqData.campus_area_id = $scope.mSelectedFloor.id
		}
		reqData.user_id =$scope.userIDSelected
		if($scope.modelPeriodSelected == null )
		{
			alert("Chưa chọn ca");return
		
		}
		else{
			reqData.select_period =$scope.modelPeriodSelected.id
		}
		reqData.week_no = 1

		reqData.day_of_week = $scope.dayofweekSelected
		reqData.date = $scope.dateSelected
		//reqData.user_type_id = $cookies.get('user_type_id');
		 //TODO
		console.log(reqData);
		mshiftService.createScheduleApi(reqData, function (respData) {
			console.log(respData);
			if (respData.code == 200) {
				alert("Chọn ca trực thành công")
				listSchedule()
				// $scope.campusLocations = respData.list_building;
				// $scope.mSelectedBuild = $scope.campusLocations[0];
				// listFloor($scope.mSelectedBuild.id)
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
	function loadCalendar(){
		var calendarEl = document.getElementById('m_shift_calendar');

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
			slotDuration: '00:30:00',
			slotLabelInterval: '00:30:00',
			slotLabelFormat: function (date)
			{
				for(var i=0; i<shiftPeriods.length; i++){
					let periodStart = shiftPeriods[i].start.split(":");
					let startHour = periodStart[0];
					if(date.date.hour==parseInt(periodStart[0])&&date.date.minute==parseInt(periodStart[1])){
						return shiftPeriods[i].name;break;
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
          	resources: $scope.checkPoints,
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


	$scope.sche =  [];

	$scope.tableDisplaysche = [];
	$scope.sche = [];
	$scope.tableParamssche = new NgTableParams({
		page: 1, 
		count: 5, 
		sorting: {},
		filter:{}
	}, {
		total: $scope.sche.length, 
		getData: function($defer,params) {
			if($scope.sche != true){
				var filteredData = params.filter() ? 
				$filter('filter')(($scope.sche), params.filter()) : 
				$scope.sche;
				var orderedData = params.sorting() ? 
				$filter('orderBy')(filteredData, params.orderBy()) : 
				$scope.sche;
        		params.total(orderedData.length); // set total for recalc pagination
        		$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        		$scope.tableDisplaysche = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

        	}
        }
    });
	function getSchedules() {
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		
		console.log(reqData);
		mshiftService.ListSchedulesApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				$scope.sche=respData.sche;

				$scope.tableParamssche.reload();
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
					title: 'Đã có lỗi xảy ra...',
					text: respData.description
				})
			} 
		});
	}

	$scope.exportReport = exportReport;
	// function exportReport() {
	// 	var reqData = {};
	// 	reqData.session_id = $cookies.get('session_id');
		
	// 	console.log(reqData);
	// 	mshiftService.ExportReportApi(reqData, function (respData) {
	// 		console.log(respData);
	// 		if(respData.code == 200 ) {
	// 			$scope.report_link=respData.link;
	// 			window.open($scope.report_link, '_blank');
	// 		}else if(respData.code == 700){
	// 			Swal.fire({
	// 				  type: 'error',
	// 				  title: 'Phiên đăng nhập của bạn đã kết thúc.',
	// 				  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
	// 				})
	// 			$location.path('/login');
	// 		}else{
	// 			Swal.fire({
	// 				type: 'error',
	// 				title: 'Đã có lỗi xảy ra...',
	// 				text: respData.description
	// 			})
	// 		} 
	// 	});
	// }
function exportReport()
{
	var title =$scope.week_detail
	var area = $scope.schedule_detail
       
	exportReportWeek ($scope.week_no_select,2,title,area)
}
	// function exportExcel(){
		 function exportReportWeek (from,to,title,area) {
            const WORKBOOK = new ExcelJS.Workbook();
            const sheet = WORKBOOK.addWorksheet('Ngày - Tuần', { views: [{ showGridLines: false }] });

            // Style 
            const BORDER = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }

            const FONT_RED = {
                name : "Times New Roman",
                size : 11,
                color : {argb : 'FFff4d4d'},
                bold : true,
            }

            const FONT_BLUE = {
                name : "Times New Roman",
                size : 11,
                color : {argb : 'FF2dadf7'},
                bold : true,
            }

            const FONT_BLACK = {
                name : "Times New Roman",
                size : 11,
                color : {argb : 'FF080808'},
                bold : true,
            }

            const ALIGNMENT = {
                vertical : 'middle',
                horizontal : 'center'
            }

            const ALIGNMENT_WRAP = {
                vertical : 'center',
                horizontal : 'center',
                wrapText: true
            }

            const ALIGNMENT_TEXT = {
                vertical : 'middle',
                horizontal : 'left'
            }

            const FONT_BOLD = {
                name : "Times New Roman",
                size : 11,
                bold : true,
            }

            const FONT_ITALIC = {
                name : "Times New Roman",
                size : 11,
                bold : true,
                italic : true,
            }

            const FONT_NORMAL_ITALIC = {
                name : "Times New Roman",
                size : 10,
                bold : true,
                italic : true,
            }

            const FONT = {
                name : "Times New Roman",
                size : 10,
            }

            // init value 
            const ROW_START = 1;
            const COL_START = 1;
            let ROW_CURRENT = ROW_START;
            let COL_CURRENT = COL_START;
            let CELL_TEMP;

            // CREATE EXCEL TO SHEET 
            // create header
            CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT+1);
            CELL_TEMP.value = "TRUNG TÂM DỊCH VỤ";
			CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT+17);
			CELL_TEMP.font = FONT_BOLD;
            CELL_TEMP.value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
            ROW_CURRENT += 1 ;
            COL_CURRENT  = 1 ;

            CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
            CELL_TEMP.value = "TỔ QL PHÒNG HỌC GIẢNG ĐƯỜNG";
			CELL_TEMP.font = FONT_BOLD;
			CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT+18);
			CELL_TEMP.font = FONT_BOLD;
            CELL_TEMP.value = "Độc lập - Tự do - Hạnh phúc";
            ROW_CURRENT += 1 ;
            COL_CURRENT  = 1 ;

            CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
            CELL_TEMP.value = "";
            ROW_CURRENT += 1 ;
            COL_CURRENT  = 1 ;

            sheet.mergeCells(ROW_CURRENT,COL_CURRENT,ROW_CURRENT,COL_CURRENT+20);
            CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
            CELL_TEMP.value = "BẢNG PHÂN CÔNG CÔNG VIỆC ";
            CELL_TEMP.alignment = ALIGNMENT;
            CELL_TEMP.font = FONT_BOLD;
            ROW_CURRENT += 1;
            COL_CURRENT  = 1;

            sheet.mergeCells(ROW_CURRENT,COL_CURRENT,ROW_CURRENT,COL_CURRENT+20);
            CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
            CELL_TEMP.value = `Tuần ${from} năm 2023`;
            CELL_TEMP.alignment = ALIGNMENT;
            CELL_TEMP.font = FONT_BOLD;
            ROW_CURRENT += 1;
            COL_CURRENT  = 1;

            // create title excel 
            sheet.mergeCells(ROW_CURRENT,COL_CURRENT,ROW_CURRENT+1,COL_CURRENT);
            CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
            CELL_TEMP.value = "STT";
            sheet.getColumn(COL_CURRENT).width = 5;
            CELL_TEMP.border = BORDER;
            CELL_TEMP.alignment = ALIGNMENT;
            CELL_TEMP.font = FONT_BLACK;
            COL_CURRENT += 1;

            sheet.mergeCells(ROW_CURRENT,COL_CURRENT,ROW_CURRENT+1,COL_CURRENT);
            CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
            CELL_TEMP.value = "Họ và tên";
            sheet.getColumn(COL_CURRENT).width = 32;
            CELL_TEMP.border = BORDER;
            CELL_TEMP.alignment = ALIGNMENT;
            CELL_TEMP.font = FONT_BLACK;
            COL_CURRENT += 1;

            title.forEach((item,index)=>{
                //sheet.mergeCells(ROW_CURRENT,COL_CURRENT,ROW_CURRENT,COL_CURRENT+item.title.length-1);
                CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
                CELL_TEMP.value = item.date;
                CELL_TEMP.border = BORDER;
                CELL_TEMP.alignment = ALIGNMENT;
                CELL_TEMP.font = FONT_BLACK;
				ROW_CURRENT +=1;
				CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
                CELL_TEMP.value = "Thứ" + item.day_of_week;
                CELL_TEMP.border = BORDER;
                CELL_TEMP.alignment = ALIGNMENT;
                CELL_TEMP.font = FONT_BLACK;
				COL_CURRENT += 1;
				ROW_CURRENT =ROW_CURRENT - 1;
                // item.title.forEach((item_shift,index_shift)=>{
                //     CELL_TEMP = sheet.getRow(ROW_CURRENT+1).getCell(COL_CURRENT);
                //     sheet.getColumn(COL_CURRENT).width = 8;
                //     CELL_TEMP.value = item_shift;
                //     CELL_TEMP.border = BORDER;
                //     CELL_TEMP.alignment = ALIGNMENT_WRAP;
                //     CELL_TEMP.font = FONT_BLACK;
                //     COL_CURRENT += 1;
                // })
            })
            ROW_CURRENT +=2;
            COL_CURRENT = 1;

            // create body excel
            area.forEach((item,index)=>{
                CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
                CELL_TEMP.value = index+1;
                CELL_TEMP.border = BORDER;
                CELL_TEMP.alignment = ALIGNMENT;
                CELL_TEMP.font = FONT;
                COL_CURRENT +=1;

                CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
                CELL_TEMP.value = item.user_name;
                CELL_TEMP.border = BORDER;
                CELL_TEMP.alignment = ALIGNMENT_TEXT;
                CELL_TEMP.font = FONT;
                COL_CURRENT +=1;

                item.schedule_week.forEach((item_shift,index_shift)=>{
                    // if(item_shift.toUpperCase() === "K"){
                    //     CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
                    //     CELL_TEMP.value = item_shift;
                    //     CELL_TEMP.border = BORDER;
                    //     CELL_TEMP.alignment = ALIGNMENT;
                    //     CELL_TEMP.font = FONT_RED;
                    //     COL_CURRENT +=1;
                    // }else if(item_shift.indexOf('/')>=0){
                    //     let array_temp = item_shift.split("/");
                    //     if(+array_temp[0]===+array_temp[1]){
                    //         CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
                    //         CELL_TEMP.value = item_shift;
                    //         CELL_TEMP.border = BORDER;
                    //         CELL_TEMP.alignment = ALIGNMENT;
                    //         CELL_TEMP.font = FONT_BLACK;
                    //         COL_CURRENT +=1;
                    //     }else if(+array_temp[0]<=((+array_temp[1])/2)){
                    //         CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
                    //         CELL_TEMP.value = item_shift;
                    //         CELL_TEMP.border = BORDER;
                    //         CELL_TEMP.alignment = ALIGNMENT;
                    //         CELL_TEMP.font = FONT_RED;
                    //         COL_CURRENT +=1;
                    //     }else{
                    //         CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
                    //         CELL_TEMP.value = item_shift;
                    //         CELL_TEMP.border = BORDER;
                    //         CELL_TEMP.alignment = ALIGNMENT;
                    //         CELL_TEMP.font = FONT_BLUE;
                    //         COL_CURRENT +=1;
                    //     }
                    // }else{
                        CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
                            CELL_TEMP.value = item_shift.area_info;
                            CELL_TEMP.border = BORDER;
                            CELL_TEMP.alignment = ALIGNMENT;
                            CELL_TEMP.font = FONT;
                            COL_CURRENT +=1;
                    // }

                })

                ROW_CURRENT +=1;
                COL_CURRENT  =1;
            })

            // create footer 
            sheet.mergeCells(ROW_CURRENT,COL_CURRENT+1,ROW_CURRENT,COL_CURRENT+19);
            CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT+1);
            CELL_TEMP.font = FONT_NORMAL_ITALIC;
            CELL_TEMP.alignment = ALIGNMENT_TEXT;
            sheet.getRow(ROW_CURRENT).height = 110.5;
            CELL_TEMP.value = `Ghi chú:
Thời gian các ca Ca 1 (từ 6h00 đến 14h00); Ca 2 (từ 13h30 đến 21h30);
- Không thực hiện checkin: ký hiệu K (chữ màu đỏ)
- Trong trường hợp đổi ca trực với lý do chính đáng, Anh/Chị đổi ca báo cáo với Tổ trưởng. Anh/Chị chú ý bật điều hòa tại các phòng học để tối ưu cho nhu cầu sử dụng GV/SV`

CELL_TEMP = sheet.getRow(ROW_CURRENT+3).getCell(COL_CURRENT+3);
CELL_TEMP.font = FONT_BOLD;
CELL_TEMP.value = "LÃNH ĐẠO TRUNG TÂM DỊCH VỤ";
CELL_TEMP = sheet.getRow(ROW_CURRENT+3).getCell(COL_CURRENT+18);
CELL_TEMP.value = "Hà Nội, ngày    tháng    năm     ";
CELL_TEMP = sheet.getRow(ROW_CURRENT+4).getCell(COL_CURRENT+17);
CELL_TEMP.font = FONT_BOLD;
CELL_TEMP.value = "Tổ trưởng tổ quản lý phòng học giảng đường";

            //EXPORT FILE 
            WORKBOOK.xlsx.writeBuffer({ base64: true })
                .then(function (xls64) {
                    var a = document.createElement("a");
                    var data = new Blob([xls64]);
                    var url = URL.createObjectURL(data);
                    a.href = url;
                    a.download = `Bảng phân công công việc tuan ${from}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function () {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                })
                .catch(function (error) {
                    console.log(error.message);
                });
        }	
	// }
	/*$scope.PrintDIV = function (divID, printTitle) {
        var contents = document.getElementById(divID).innerHTML;
        var body = document.getElementsByTagName("BODY")[0];

        //Create a dynamic IFRAME.
        var frame1 = document.createElement("IFRAME");
        frame1.name = "frame1";
        frame1.setAttribute("style", "position:absolute;top:-1000000px");
        body.appendChild(frame1);

        //Create a Frame Document.
        var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
        frameDoc.document.open();

        //Create a new HTML document.
        frameDoc.document.write('<html><head><title>'+ printTitle + '</title>');
        frameDoc.document.write('</head><body>');

        //Append the external CSS file.
        frameDoc.document.write('<link href="assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />');

        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();

        $window.setTimeout(function () {
            $window.frames["frame1"].focus();
            $window.frames["frame1"].print();
            body.removeChild(frame1);
        }, 500);
    };*/

}]);