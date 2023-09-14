angular
.module('PAMSapp')
.controller('mscheduleController', 
['$rootScope', '$scope', '$window', '$interval', '$location', '$filter', 'mscheduleService', 'NgTableParams','$cookies',
	function ($rootScope, $scope, $window, $interval, $location, $filter, mscheduleService, NgTableParams,$cookies) {

	$rootScope.elem=null ;
	var shiftPeriods = [
		{
			"id": 1,
			"name": "C1",
			"start": "06:00",
			"end": "14:00"
		},{
			"id": 2,
			"name": "C2",
			"start": "13:30",
			"end": "21:30"
		}
	];

	$scope.campusLocations = [
		{
			"id": 0,
			"name": "Tất cả"
		},{
			"id": 1,
			"name": "A1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ssssssssssssssssssss"
		},{
			"id": 2,
			"name": "A2"
		},{
			"id": 3,
			"name": "A3"
		}
	];
	$scope.mSelectedLoc = $scope.campusLocations[1];

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
        var test =[]
        renderTimetableOfWeek("2023-01-30",test)

		// listRoom(116);
	})();

	function listCheckPoints(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.user_type_id = $cookies.get('user_type_id');
		console.log(reqData);
		/*mscheduleService.GetAreaByParentApi(reqData, function (respData) {
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

	function listRoom(area_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.user_type_id = $cookies.get('user_type_id');
		reqData.area_id = area_id;
		console.log(reqData);
		mscheduleService.GetAreaByParentApi(reqData, function (respData) {
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
    function renderTimetableOfWeek(start_date,list_classes)
    {
        console.log(start_date)
        $scope.isCalendarCheck = true
        $scope.config = {
            scale: "Day",
            days: 7,
            startDate: start_date,
            cellWidth:220,
            onEventMoved: function(args) {
                $scope.dp.message("Event moved: " + args.e.text());
            },
            eventClickHandling: "Select",
            onEventSelected: function(args) {
                // $scope.selectedEvents = $scope.dp.multiselect.events();
                // $scope.$apply();
            },
            timeHeaders: [
                {groupBy: "Month"},
                {groupBy: "Cell", format: "d - dddd"},
            ],
            resources: [
                {name: "NVA", id: "1"},
                {name: "NVB", id: "2"},
                {name: "NVC", id: "3"},
                {name: "NVD", id: "4"},
                {name: "NVE", id: "5"},
                {name: "NVF", id: "6"}
            ]
        };
        // var dp = new DayPilot.Scheduler("timetable");
        // // ...
        // dp.resources = [
        //   { name: "Room A", id: "A" },
        //   { name: "Room B", id: "B" },
        //   { name: "Room C", id: "C" }
        // ];
        // dp.init();
        // var list_events =  
        //     list_classes.map( function (classes) {
        //       // var children = await getCampusAreaTree(area.ID)
        //       // var type_name = await getTypeAreaCampusName(area.Loai)
        //       var  classes_info = {
        //         start: new DayPilot.Date(classes.start_date),
        //         end: new DayPilot.Date(classes.end_date),
        //         id: DayPilot.guid(),
        //         text: classes.subject_name
        //       }
        //       return classes_info
        //   })
        //   console.log(list_events)
        $scope.events =[{
            
                start: new DayPilot.Date("2023-01-30T00:00:00"),
                end: new DayPilot.Date("2023-01-30T00:00:00"),
                id: DayPilot.guid(),
                resource: "1",
                text: "Ca1 - Tầng 1-Nhà A2"
            
        },
        {
            
            start: new DayPilot.Date("2023-01-30T00:00:00"),
            end: new DayPilot.Date("2023-01-30T00:00:00"),
            id: DayPilot.guid(),
            resource: "2",
            text: "Ca2- Tầng 2 - Nhà A2"
        
    }]
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
		mscheduleService.ListSchedulesApi(reqData, function (respData) {
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
	function exportReport() {
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		
		console.log(reqData);
		mscheduleService.ExportReportApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				$scope.report_link=respData.link;
				window.open($scope.report_link, '_blank');
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


//////Print Schedule



    $scope.exportReportWeek = function (from,to,title,area) {
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
		CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
		CELL_TEMP.value = "CÔNG TY CP DVBV NGÂN HÀNG Á CHÂU";
		ROW_CURRENT += 1 ;
		COL_CURRENT  = 1 ;

		CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
		CELL_TEMP.value = "";
		ROW_CURRENT += 1 ;
		COL_CURRENT  = 1 ;

		CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
		CELL_TEMP.value = "";
		ROW_CURRENT += 1 ;
		COL_CURRENT  = 1 ;

		sheet.mergeCells(ROW_CURRENT,COL_CURRENT,ROW_CURRENT,COL_CURRENT+20);
		CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
		CELL_TEMP.value = "BẢNG RÀ SOÁT CÔNG TÁC TUẦN TRA CHECKIN EZWORK NGOÀI GIỜ TẠI CÁC TỔ BẢO VỆ(NGÀY/TUẦN)";
		CELL_TEMP.alignment = ALIGNMENT;
		CELL_TEMP.font = FONT_BOLD;
		ROW_CURRENT += 1;
		COL_CURRENT  = 1;

		sheet.mergeCells(ROW_CURRENT,COL_CURRENT,ROW_CURRENT,COL_CURRENT+20);
		CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
		CELL_TEMP.value = `Thời gian: Từ ${from} đến ${to}`;
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
		CELL_TEMP.value = "Đơn vị";
		sheet.getColumn(COL_CURRENT).width = 32;
		CELL_TEMP.border = BORDER;
		CELL_TEMP.alignment = ALIGNMENT;
		CELL_TEMP.font = FONT_BLACK;
		COL_CURRENT += 1;

		title.forEach((item,index)=>{
			sheet.mergeCells(ROW_CURRENT,COL_CURRENT,ROW_CURRENT,COL_CURRENT+item.title.length-1);
			CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
			CELL_TEMP.value = item.date;
			CELL_TEMP.border = BORDER;
			CELL_TEMP.alignment = ALIGNMENT;
			CELL_TEMP.font = FONT_BLACK;
			
			item.title.forEach((item_shift,index_shift)=>{
				CELL_TEMP = sheet.getRow(ROW_CURRENT+1).getCell(COL_CURRENT);
				sheet.getColumn(COL_CURRENT).width = 8;
				CELL_TEMP.value = item_shift;
				CELL_TEMP.border = BORDER;
				CELL_TEMP.alignment = ALIGNMENT_WRAP;
				CELL_TEMP.font = FONT_BLACK;
				COL_CURRENT += 1;
			})
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
			CELL_TEMP.value = item.area_name;
			CELL_TEMP.border = BORDER;
			CELL_TEMP.alignment = ALIGNMENT_TEXT;
			CELL_TEMP.font = FONT;
			COL_CURRENT +=1;

			item.result.forEach((item_shift,index_shift)=>{
				if(item_shift.toUpperCase() === "K"){
					CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
					CELL_TEMP.value = item_shift;
					CELL_TEMP.border = BORDER;
					CELL_TEMP.alignment = ALIGNMENT;
					CELL_TEMP.font = FONT_RED;
					COL_CURRENT +=1;
				}else if(item_shift.indexOf('/')>=0){
					let array_temp = item_shift.split("/");
					if(+array_temp[0]===+array_temp[1]){
						CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
						CELL_TEMP.value = item_shift;
						CELL_TEMP.border = BORDER;
						CELL_TEMP.alignment = ALIGNMENT;
						CELL_TEMP.font = FONT_BLACK;
						COL_CURRENT +=1;
					}else if(+array_temp[0]<=((+array_temp[1])/2)){
						CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
						CELL_TEMP.value = item_shift;
						CELL_TEMP.border = BORDER;
						CELL_TEMP.alignment = ALIGNMENT;
						CELL_TEMP.font = FONT_RED;
						COL_CURRENT +=1;
					}else{
						CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
						CELL_TEMP.value = item_shift;
						CELL_TEMP.border = BORDER;
						CELL_TEMP.alignment = ALIGNMENT;
						CELL_TEMP.font = FONT_BLUE;
						COL_CURRENT +=1;
					}
				}else{
					CELL_TEMP = sheet.getRow(ROW_CURRENT).getCell(COL_CURRENT);
						CELL_TEMP.value = item_shift;
						CELL_TEMP.border = BORDER;
						CELL_TEMP.alignment = ALIGNMENT;
						CELL_TEMP.font = FONT_RED;
						COL_CURRENT +=1;
				}

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
		CELL_TEMP.value = `Ghi chú: Hướng dẫn cách cập nhật 
- Thời gian 01 ngày được tính từ lần checkin lượt thứ nhất lúc 21h00 đến 05h00 ngày hôm sau
Từ thứ hai đến thứ sáu: Ca 1 (từ 21h00 đến 22h59); Ca 2 (từ 23h00 đến 00h59); Ca 3 (từ 1h00 đến 02h59); Ca 4 (từ 03h00 đến 04h59)
Thứ bảy: Ca 1 (từ 12h00 đến 14h00); Ca 2 (từ 16h00 đến 18h00) và 04 ca trực đêm như trên
Chủ nhật:  Ca 1 (từ 08h00 đến 10h00); Ca 2 (từ 12h00 đến 14h00); Ca 3 (từ 16h00 đến 18h00) và 04 ca trực đêm như trên
- Không thực hiện checkin: ký hiệu K (chữ màu đỏ)
- Thực hiện check thiếu điểm trực/thiếu tem: Số lượng điểm trực đã check thực tế /số điểm trực tại Đơn vị:
VD: Đơn vị A tổng có 18 điểm trực/tem. Trường hợp NVBV checkin 16 điểm trực/tem thì cập nhật: 16/18 (chữ màu xanh). Trường hợp checkin đủ điểm trực/tem thì cập nhật 18/18 (chữ màu đen)`




		//EXPORT FILE 
		WORKBOOK.xlsx.writeBuffer({ base64: true })
			.then(function (xls64) {
				var a = document.createElement("a");
				var data = new Blob([xls64]);
				var url = URL.createObjectURL(data);
				a.href = url;
				a.download = `Mau theo doi kiem tra Ezwork hang ngay - tuan tu ${from} đen ${to}.xlsx`;
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