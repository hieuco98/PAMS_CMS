angular.module("PAMSapp").controller("mcalController", [
  "$rootScope",
  "$scope",
  "$window",
  "$interval",
  "$location",
  "$filter",
  "mcalService",
  "NgTableParams",
  "$cookies",
  function (
    $rootScope,
    $scope,
    $window,
    $interval,
    $location,
    $filter,
    mcalService,
    NgTableParams,
    $cookies
  ) {
    $rootScope.elem = null;
    var lessonPeriods = [
      {
        id: 1,
        name: "Kíp 1",
        start: "07:30",
        end: "09:20",
      },
      {
        id: 2,
        name: "Kíp 2",
        start: "09:30",
        end: "11:20",
      },
      {
        id: 3,
        name: "Kíp 3",
        start: "12:30",
        end: "14:20",
      },
      {
        id: 4,
        name: "Kíp 4",
        start: "14:30",
        end: "16:20",
      },
      {
        id: 5,
        name: "Kíp 5",
        start: "16:30",
        end: "18:20",
      },
      {
        id: 6,
        name: "Kíp 6",
        start: "19:30",
        end: "21:20",
      },
    ];

    // $scope.campusLocations = [
    // 	{
    // 		"id": 0,
    // 		"name": "Tất cả"
    // 	},{
    // 		"id": 1,
    // 		"name": "A1"
    // 	},{
    // 		"id": 2,
    // 		"name": "A2"
    // 	},{
    // 		"id": 3,
    // 		"name": "A3"
    // 	}
    // ];
    //$scope.mSelectedLoc = $scope.campusLocations[1];



	
    $scope.semesterList = [
      {
        id: 1,
        name: "2022-2023",
      },
      {
        id: 2,
        name: "2023-2024",
      },
    ];
    // $scope.mSelectedRoomTye = $scope.roomTypes[0];

    $scope.roomCapacities = [
      {
        id: 0,
        name: "Tất cả",
      },
      {
        id: 1,
        name: "0-15",
      },
      {
        id: 2,
        name: "30",
      },
      {
        id: 3,
        name: "50",
      },
      {
        id: 4,
        name: "75",
      },
      {
        id: 5,
        name: ">100",
      },
    ];
    $scope.mSelectedCap = $scope.roomCapacities[0];
    $scope.isCalendarCheck = false;
    $scope.isClassesSelected = false;

    $scope.tableDisplayClasses = [];
    $scope.tableDataClasses = [];
    $scope.tableParamsClasses = new NgTableParams(
      {
        page: 1, // show first page
        count: 5, // count per page
        filter: {},
        sorting: {},
      },
      {
        total: $scope.tableDataClasses.length, // length of data
        getData: function ($defer, params) {
          var filteredData = params.filter()
            ? $filter("filter")($scope.tableDataClasses, params.filter())
            : $scope.tableDataClasses;
          var orderedData = params.sorting()
            ? $filter("orderBy")(filteredData, params.orderBy())
            : $scope.tableDataClasses;
          params.total(orderedData.length);
          $defer.resolve(
            orderedData.slice(
              (params.page() - 1) * params.count(),
              params.page() * params.count()
            )
          );
          $scope.tableDisplayClasses = orderedData.slice(
            (params.page() - 1) * params.count(),
            params.page() * params.count()
          );
        },
      }
    );

    //=============================================================================
    (function initController() {
      // listQuizSession();
      var test = [
        {
          id: 16452,
          subject_id: "FIA1321",
          subject_name: "Nguyên lý kế toán",
          class_id: "D21-174",
          batch: "D21",
          group: "01",
          buiding: "Nhà A3",
          class_name: "Phòng 311",
          day_of_week: 2,
          start_date: "2023-01-30T07:00:00.000Z",
          end_date: "2023-01-30T08:50:00.000Z",
          starting_block: 1,
          Lecturer: "Nguyễn Văn Hậu",
        },
        {
          id: 16474,
          subject_id: "FIA1321",
          subject_name: "Nguyên lý kế toán",
          class_id: "D21-175",
          batch: "D21",
          group: "02",
          buiding: "Nhà A3",
          class_name: "Phòng 311",
          day_of_week: 2,
          start_date: "2023-01-30T09:00:00.000Z",
          end_date: "2023-01-30T10:50:00.000Z",
          starting_block: 3,
          Lecturer: "Nguyễn Văn Hậu",
        },
        {
          id: 16467,
          subject_id: "FIA1321",
          subject_name: "Nguyên lý kế toán",
          class_id: "D21-174",
          batch: "D21",
          group: "01",
          buiding: "Nhà A3",
          class_name: "Phòng 311",
          day_of_week: 2,
          start_date: "2023-01-30T12:00:00.000Z",
          end_date: "2023-01-30T13:50:00.000Z",
          starting_block: 5,
          Lecturer: "Nguyễn Văn Hậu",
        },
        {
          id: 1,
          subject_id: "INT1303",
          subject_name: "An toàn và bảo mật HTTT",
          class_id: "D20-001",
          batch: "D20",
          group: "01",
          buiding: "Nhà A3",
          class_name: "Phòng 311",
          day_of_week: 4,
          start_date: "2023-02-01T07:00:00.000Z",
          end_date: "2023-02-01T08:50:00.000Z",
          starting_block: 1,
          Lecturer: "Đinh Trường Duy",
        },
        {
          id: 24,
          subject_id: "INT1303",
          subject_name: "An toàn và bảo mật HTTT",
          class_id: "D20-002",
          batch: "D20",
          group: "02",
          buiding: "Nhà A3",
          class_name: "Phòng 311",
          day_of_week: 4,
          start_date: "2023-02-01T09:00:00.000Z",
          end_date: "2023-02-01T10:50:00.000Z",
          starting_block: 3,
          Lecturer: "Đinh Trường Duy",
        },
        {
          id: 16,
          subject_id: "INT1303",
          subject_name: "An toàn và bảo mật HTTT",
          class_id: "D20-001",
          batch: "D20",
          group: "01",
          buiding: "Nhà A3",
          class_name: "Phòng 311",
          day_of_week: 4,
          start_date: "2023-02-01T12:00:00.000Z",
          end_date: "2023-02-01T13:50:00.000Z",
          starting_block: 5,
          Lecturer: "Đinh Trường Duy",
        },
        {
          id: 16541,
          subject_id: "FIA1321",
          subject_name: "Nguyên lý kế toán",
          class_id: "D21-178",
          batch: "D21",
          group: "05",
          buiding: "Nhà A3",
          class_name: "Phòng 311",
          day_of_week: 6,
          start_date: "2023-02-03T07:00:00.000Z",
          end_date: "2023-02-03T08:50:00.000Z",
          starting_block: 1,
          Lecturer: "Nguyễn Thị Chinh Lam",
        },
        {
          id: 16562,
          subject_id: "FIA1321",
          subject_name: "Nguyên lý kế toán",
          class_id: "D21-179",
          batch: "D21",
          group: "06",
          buiding: "Nhà A3",
          class_name: "Phòng 311",
          day_of_week: 6,
          start_date: "2023-02-03T09:00:00.000Z",
          end_date: "2023-02-03T10:50:00.000Z",
          starting_block: 3,
          Lecturer: "Nguyễn Thị Chinh Lam",
        },
        {
          id: 16556,
          subject_id: "FIA1321",
          subject_name: "Nguyên lý kế toán",
          class_id: "D21-178",
          batch: "D21",
          group: "05",
          buiding: "Nhà A3",
          class_name: "Phòng 311",
          day_of_week: 6,
          start_date: "2023-02-03T12:00:00.000Z",
          end_date: "2023-02-03T13:50:00.000Z",
          starting_block: 5,
          Lecturer: "Nguyễn Thị Chinh Lam",
        },
      ];
      // f1();
      listBuilding(); //default for CS1 HD
      // loadCalendar();
      //renderTimetableOfWeek("2023-01-30",test)

      //listRoom(180);//Tang 4 nha A3

      // getTimeTable(2023, new Date().getMonth()+1);//current month, as January=0
      getTimeTable(2023, new Date().getMonth() + 2); //current month, as January=0

      // loadX();
    })();

    function listBuilding() {
      var reqData = {};
      reqData.session_id = $cookies.get("session_id");
      //reqData.user_type_id = $cookies.get('user_type_id');
      //TODO
      console.log(reqData);
      mcalService.GetBuildingApi(reqData, function (respData) {
        console.log(respData);
        if (respData.code == 200) {
          $scope.campusLocations = respData.list_building;
          $scope.mSelectedBuild = $scope.campusLocations[0];
          listFloor($scope.mSelectedBuild.id);
          // fnChangeRootProg($scope.modelProgSelected);
        } else if (respData.code == 700) {
          Swal.fire({
            type: "error",
            title: "Phiên đăng nhập của bạn đã kết thúc.",
            text: "Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.",
          });
          $location.path("/login");
        } else {
          Swal.fire({
            type: "error",
            title: "Đã có lỗi xảy ra",
            text: "Lỗi GetAreaByParentApi! " + respData.description,
          });
        }
      });
    }

    function listFloor(parent_id) {
      var reqData = {};
      reqData.session_id = $cookies.get("session_id");

      reqData.parent_id = parent_id;
      reqData.type = 5;
      mcalService.GetAreaByParentApi(reqData, function (respData) {
        console.log(respData);
        if (respData.code == 200) {
          $scope.floorList = respData.list_area;
          $scope.mSelectedFloor = $scope.floorList[0];
          listRoom($scope.mSelectedFloor.id);
          // fnChangeRootProg($scope.modelProgSelected);
        } else if (respData.code == 700) {
          Swal.fire({
            type: "error",
            title: "Phiên đăng nhập của bạn đã kết thúc.",
            text: "Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.",
          });
          $location.path("/login");
        } else {
          Swal.fire({
            type: "error",
            title: "Đã có lỗi xảy ra",
            text: "Lỗi GetAreaByParentApi! " + respData.description,
          });
        }
      });
    }
    function listRoom(area_id) {
      var reqData = {};
      reqData.session_id = $cookies.get("session_id");

      reqData.parent_id = area_id;
      reqData.type = 13;
      mcalService.GetAreaByParentApi(reqData, function (respData) {
        console.log(respData);
        if (respData.code == 200) {
          $scope.roomList = respData.list_area;
          $scope.mSelectedRoom = $scope.roomList[0];
          //listRoom($scope.mSelectedRoom.id)
        } else if (respData.code == 700) {
          Swal.fire({
            type: "error",
            title: "Phiên đăng nhập của bạn đã kết thúc.",
            text: "Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.",
          });
          $location.path("/login");
        } else {
          Swal.fire({
            type: "error",
            title: "Đã có lỗi xảy ra",
            text: "Lỗi GetAreaByParentApi! " + respData.description,
          });
        }
      });
    }

    $scope.ChangeBuiding = function (buildinginfo) {
      listFloor(buildinginfo.id);
      $scope.mSelectedBuild = buildinginfo;
    };
    $scope.ChangeFloor = function (floorinfo) {
      listRoom(floorinfo.id);
      $scope.mSelectedFloor = floorinfo;
    };
    $scope.findTimetableClass = function (
      mSelectedBuild,
      mSelectedRoom,
      findDate,
      mSelectedSemester
    ) {
      var reqData = {};
      reqData.session_id = $cookies.get("session_id");
      if (findDate != undefined) {
        reqData.date = findDate;
      } else {
        alert("Chưa điền ngày tìm kiếm");
        return;
      }
      if (mSelectedBuild != undefined) {
        reqData.building = mSelectedBuild.name;
      } else {
        alert("Chưa chọn tòa nhà");
        return;
      }
      if (mSelectedRoom != undefined) {
        reqData.class = mSelectedRoom.name;
      } else {
        alert("Chưa chọn lớp học");
        return;
      }
      if (mSelectedSemester != undefined) {
        reqData.semester = mSelectedSemester.name;
        $scope.semesterSelect = mSelectedSemester.name;
      } else {
        alert("Chưa chọn kì học");
        return;
      }

      mcalService.GetTimetableOfClassApi(reqData, function (respData) {
        console.log(respData);
        if (respData.code == 200) {
		  console.log(respData.list_classes)
          $scope.tableDataClasses = respData.list_classes;
          $scope.tableParamsClasses.reload();
          var week = respData.list_classes[0].week_no;
          var semester = mSelectedSemester.name;
          $scope.week_no = respData.list_classes[0].week_no;
          $scope.class_name = mSelectedRoom.name;
          getTimetableByWeek(
            mSelectedBuild.name,
            mSelectedRoom.name,
            week,
            semester
          );
          // $scope.floorList = respData.list_area;
          // $scope.mSelectedFloor = $scope.floorList[0];
          // listRoom($scope.mSelectedFloor.id)
          // fnChangeRootProg($scope.modelProgSelected);
        } else if (respData.code == 700) {
          Swal.fire({
            type: "error",
            title: "Phiên đăng nhập của bạn đã kết thúc.",
            text: "Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.",
          });
          $location.path("/login");
        } else {
          Swal.fire({
            type: "error",
            title: "Đã có lỗi xảy ra",
            text: "Lỗi GetAreaByParentApi! " + respData.description,
          });
        }
      });
    };
    function getTimeTable(year, month) {
      var reqData = {};
      reqData.session_id = $cookies.get("session_id");
      reqData.year = year;
      reqData.month = month;
      mcalService.GetTimeTableApi(reqData, function (respData) {
        if (respData.code == 200) {
          console.log(respData);
          $scope.tt_data = respData.ttb; //TODO
          console.log(respData.ttb);
          console.log($scope.tt_data);
          // $scope.events1  = respData.ttb;
          // loadCalendar();
        } else if (respData.code == 700) {
          Swal.fire({
            type: "error",
            title: "Phiên đăng nhập của bạn đã kết thúc.",
            text: "Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.",
          });
          $location.path("/login");
        } else {
          Swal.fire({
            type: "error",
            title: "Đã có lỗi xảy ra...",
            text: "Lỗi load lịch....",
          });
        }
      });
    }
    function getTimetableByWeek(building_name, class_name, week, semester) {
      var reqData = {};
      reqData.session_id = $cookies.get("session_id");
      reqData.building = building_name;
      reqData.class = class_name;
      reqData.week = week;
      reqData.semester = semester;
      mcalService.GetTimetableOfClassByWeekApi(reqData, function (respData) {
        console.log(respData);
        if (respData.code == 200) {
          var list_classes = respData.list_classes;
          var start_day = list_classes[0].date;
          renderTimetableOfWeek(start_day, list_classes);
          // $scope.tableDataClasses = respData.list_classes;
          // $scope.tableParamsClasses.reload();
          // $scope.floorList = respData.list_area;
          // $scope.mSelectedFloor = $scope.floorList[0];
          // listRoom($scope.mSelectedFloor.id)
          // fnChangeRootProg($scope.modelProgSelected);
        } else if (respData.code == 700) {
          Swal.fire({
            type: "error",
            title: "Phiên đăng nhập của bạn đã kết thúc.",
            text: "Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.",
          });
          $location.path("/login");
        } else {
          Swal.fire({
            type: "error",
            title: "Đã có lỗi xảy ra",
            text: "Lỗi GetAreaByParentApi! " + respData.description,
          });
        }
      });
    }

	
	  //HieuCo

    function renderTimetableOfWeek(start_date, list_classes) {
      console.log(start_date);
      $scope.isCalendarCheck = true;
      $scope.config = {
        scale: "Day",
        days: 7,
        startDate: start_date,
        cellWidth: 220,
		cellHeight :  'auto',
		headerHeight : 50,
        onBeforeCellRender: function (args) {
          if (args.cell.start.getDayOfWeek() === 0) {
            args.cell.backColor = "#FF0000";
          }
        },
        onBeforeEventRender: function (args) {
          if (args.data.status == 1) {
            args.data.barColor = "orange";
          }
          if (args.data == undefined) {
            args.cell.backColor = "#008000";
          }
        },
        onEventMoved: function (args) {
          $scope.dp.message("Event moved: " + args.e.text());
        },

        eventClickHandling: "Select",
        onEventSelected: function (args) {
          $scope.selectedEvents = $scope.dp.multiselect.events();
          $scope.$apply();
        },
        timeHeaders: [
          { groupBy: "Month" },
          { groupBy: "Cell", format: "d - dddd" },
        ],
        resources: [
          { name: "Sáng", id: 1 },
          { name: "Chiều", id: 2 },
          { name: "Tối", id: 3 },
        //   { name: "Tiết 4", id: 4 },
        //   { name: "Tiết 5", id: 5 },
        //   { name: "Tiết 6", id: 6 },
        //   { name: "Tiết 7", id: 7 },
        //   { name: "Tiết 8", id: 8 },
        //   { name: "Tiết 9", id: 9 },
        //   { name: "Tiết 10", id: 10 },
        //   { name: "Tiết 11", id: 11 },
        //   { name: "Tiết 12", id: 12 },
        //   { name: "Tiết 13", id: 13 },
        ],



      };
      // var dp = new DayPilot.Scheduler("timetable");
      // // ...
      // dp.resources = [
      //   { name: "Room A", id: "A" },
      //   { name: "Room B", id: "B" },
      //   { name: "Room C", id: "C" }
      // ];
      // dp.init();
      var classes_list = [];

	 $scope.classes_list = classes_list; 
    //   list_classes.map(function (classes) {
        // var children = await getCampusAreaTree(area.ID)
        // var type_name = await getTypeAreaCampusName(area.Loai)
        for (let i = 0; i < list_classes.length; i++) {
			console.log(i)
          var classes_info = {
            start: new DayPilot.Date(list_classes[i].start_date),
            end: new DayPilot.Date(list_classes[i].end_date),
            resource: list_classes[i].period,
            id: DayPilot.guid(),
            id_timetable: list_classes[i].id,
            text: list_classes[i].subject_name,
            status: 1,
          };
          classes_list.push(classes_info);
        }
        //   return classes_info
    //   });
      console.log(classes_list);
      $scope.events = classes_list;
    }

	//HieuCo

    $scope.clickGetInfoClasses = function (a) {
      // $scope.pro_image1 = "";
      if ($scope.classes_id == a.id) {
        $("#md1").modal("hide");
        $scope.isClassesSelected = false;
        //			$scope.s01 = 0;
      } else {
        $("#md1").modal({
          backdrop: "static",
          keyboard: true,
          show: true,
        });
        $scope.isClassesSelected = true;
        $scope.classes_id = a.id;
        $scope.modelClassesSelected = a;
        //$scope.showUpdateForm = false;
        //			console.log(a);
      }
      //f51(a.pro_id);
    };

    function loadCalendar() {
      var calendarEl = document.getElementById("m_calendar");

      var calendar = new FullCalendar.Calendar(calendarEl, {
        schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
        // nextDayThreshold: '00:00:00',
        initialView: "resourceTimelineDay",
        // initialView: 'dayGridMonth',
        nowIndicator: true,
        defaultDate: new Date(),

        // initialDate: today,
        // initialDate: '2022-08-07',
        height: "auto",
        headerToolbar: {
          left: "prev,next today",
          // center: 'title addEventButton',
          center: "title",
          right:
            "resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth",
          // right: 'dayGridMonth,timeGridWeek,timeGridDay,agendaDay,listWeek'
        },
        views: {
          timeGridDay: {
            // name of view
            // titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
            // other view-specific options here
            minTime: "09:00:00",
            maxTime: "22:00:00",
          },
        },
        businessHours: {
          // days of week. an array of zero-based day of week integers (0=Sunday)
          daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

          startTime: "06:00", // a start time (10am in this example)
          endTime: "20:00", // an end time (6pm in this example)
        },
        locale: "vi",
        minTime: "07:00",
        maxTime: "22:00",
        scrollTime: "10:00",
        slotDuration: "00:15:00",
        slotLabelInterval: "00:15:00",
        slotLabelFormat: function (date) {
          for (var i = 0; i < lessonPeriods.length; i++) {
            let periodStart = lessonPeriods[i].start.split(":");
            let startHour = periodStart[0];
            if (
              date.date.hour == parseInt(periodStart[0]) &&
              date.date.minute == parseInt(periodStart[1])
            ) {
              return lessonPeriods[i].name;
              break;
            }
          }

          /*if ((date.date.hour>7&&date.date.hour<22) && date.date.minute == 30)
			        return 'Tiết '+(date.date.hour-7).toString();*/
          // return date.date.hour.toString().padStart(2, '0') + ':00';

          return "";
          // return date.date.minute;
        },

        editable: true,
        resourceAreaHeaderContent: "Phòng",
        resources: $scope.roomLists,
        // resources: 'https://fullcalendar.io/api/demo-feeds/resources.json?with-nesting&with-colors',
        events:
          "https://fullcalendar.io/api/demo-feeds/events.json?single-day&for-resource-timeline",

        eventSources: [
          {
            events: $scope.tt_data,
            color: "yellow",
            textColor: "black",
          },
          {
            // events: $scope.quiz_data,
            events: $scope.tableDataQuizSession,
            color: "blue",
            textColor: "white",
          },
        ],
        eventClick: function (info) {
          //reset student list
          $scope.tableDataStudent = [];
          $scope.tableParamsStudent.reload();

          console.log(info.event);
          console.log(info.title);
          console.log(info.event.start);
          $scope.selectedDate = info.event.start;
          // $scope.s_date = $scope.selectedDate.toISOString().split('T')[0];
          $scope.s_date = info.event.start.toISOString().split("T")[0];
          console.log($scope.s_date);
          info.jsEvent.preventDefault(); // don't let the browser navigate
          let type = info.event.extendedProps.type;
          console.log(info.event.extendedProps);
          $scope.quizTitle =
            info.event.extendedProps.prog_code +
            "--" +
            info.event.extendedProps.quizsession_title;
          console.log($scope.quizTitle);
          console.log(type);
          $scope.quizSession = info.event.extendedProps;
          console.log($scope.quizSession);
          console.log($scope.quizSession.prog_name);
          console.log($scope.quizSession.template_name);
        },
        select: function (start, end) {
          // fnGetRootProgs();
          console.log("is it??????");
          console.log(start);
          console.log(start.start);

          console.log(end);

          $("#abc").modal({
            backdrop: "static",
            keyboard: true,
            show: true,
          });
        },
        selectable: true,
        editable: true,
        // addEvent( event ),
        eventDrop: function (info) {
          alert(
            info.event.title +
              " được chuyển sang " +
              info.event.start.toISOString()
          );
          if (!confirm("Xác nhận thay đổi?")) {
            info.revert();
          }
        },
      });

      calendar.render();
    }

    $scope.events1 = [
      {
        resourceId: "d",
        title: "event 1",
        start: "2023-07-02 08:30",
        end: "2023-07-02 12:00",
        display: "background",
        backgroundColor: "green",
      },
      {
        resourceId: "c",
        title: "event 3",
        start: "2023-07-03T12:00:00+00:00",
        end: "2023-07-03T16:00:00+00:00",
        display: "background",
        backgroundColor: "red",
      },
    ];

    $scope.resource1 = [
      {
        id: "d",
        title: "Room #1",
        eventcolor: "yellow",
      },
      {
        id: "c",
        title: "Room #3",
        eventcolor: "red",
      },
    ];

    $scope.tt_data1 = [
      {
        subject_id: "INT1303",
        end_day: 5,
        resourceId: "190",
        week: 26,
        batch_id: "20",
        year: 2023,
        class_id: "D20-001",
        starttime: "05/07/2023 07:00:00",
        title: "INT1303.An toàn và bảo mật HTTT",
        type: "timetable",
        number_of_block: 2,
        building: "Nhà A3",
        end_min: 50,
        start_hour: 7,
        number_of_student: 0,
        starting_block: 1,
        end: "2023-07-05 08:50:00",
        end_hour: 8,
        day_of_week: 4,
        period: 1,
        eclass_id: "",
        start_day: 5,
        combination_id: "",
        start: "2023-07-05 07:00:00",
        lecturer: "Đinh Trường Duy",
        endtime: "05/07/2023 08:50:00",
        classroom: "Phòng 311",
        major_id: "CN",
        start_min: 0,
        lecturer_code: "AT1008",
        month: 8,
        group_id: "01",
        subgroup_id: "",
        subject_name: "An toàn và bảo mật HTTT",
        name: "TKB-HK2 2022-2023",
        display: "inverse-background",
      },
      {
        subject_id: "INT1303",
        end_day: 12,
        resourceId: "190",
        week: 27,
        batch_id: "20",
        year: 2023,
        class_id: "D20-001",
        starttime: "12/07/2023 07:00:00",
        title: "INT1303.An toàn và bảo mật HTTT",
        type: "timetable",
        number_of_block: 2,
        building: "Nhà A3",
        end_min: 50,
        start_hour: 7,
        number_of_student: 0,
        starting_block: 1,
        end: "2023-07-12 08:50:00",
        end_hour: 8,
        day_of_week: 4,
        period: 1,
        eclass_id: "",
        start_day: 12,
        combination_id: "",
        start: "2023-07-12 07:00:00",
        lecturer: "Đinh Trường Duy",
        endtime: "12/07/2023 08:50:00",
        classroom: "Phòng 311",
        major_id: "CN",
        start_min: 0,
        lecturer_code: "AT1008",
        month: 8,
        group_id: "01",
        subgroup_id: "",
        subject_name: "An toàn và bảo mật HTTT",
        name: "TKB-HK2 2022-2023",
        display: "inverse-background",
      },
      {
        subject_id: "INT1303",
        end_day: 19,
        resourceId: "190",
        week: 28,
        batch_id: "20",
        year: 2023,
        class_id: "D20-001",
        starttime: "19/07/2023 07:00:00",
        title: "INT1303.An toàn và bảo mật HTTT",
        type: "timetable",
        number_of_block: 2,
        building: "Nhà A3",
        end_min: 50,
        start_hour: 7,
        number_of_student: 0,
        starting_block: 1,
        end: "2023-07-19 08:50:00",
        end_hour: 8,
        day_of_week: 4,
        period: 1,
        eclass_id: "",
        start_day: 19,
        combination_id: "",
        start: "2023-07-19 07:00:00",
        lecturer: "Đinh Trường Duy",
        endtime: "19/07/2023 08:50:00",
        classroom: "Phòng 311",
        major_id: "CN",
        start_min: 0,
        lecturer_code: "AT1008",
        month: 8,
        group_id: "01",
        subgroup_id: "",
        subject_name: "An toàn và bảo mật HTTT",
        name: "TKB-HK2 2022-2023",
        display: "inverse-background",
      },
    ];

    function loadX() {
      console.log("X calendar called....");
      var calendarEl = document.getElementById("calendar1");

      var calendar = new FullCalendar.Calendar(calendarEl, {
        schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
        timeZone: "UTC",
        initialView: "resourceTimelineDay",
        aspectRatio: 1.5,
        height: "auto",
        headerToolbar: {
          left: "prev,next today custom1",
          center: "title",
          right:
            "resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth",
        },
        customButtons: {
          custom1: {
            text: "Tới ngày tiếp",
            click: function () {
              alert("Tới ngày tiếp theo có phòng trống!");
            },
          },
        },
        businessHours: {
          // days of week. an array of zero-based day of week integers (0=Sunday)
          daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

          startTime: "06:00", // a start time (10am in this example)
          endTime: "20:00", // an end time (6pm in this example)
        },
        locale: "vi",
        minTime: "07:00",
        maxTime: "22:00",

        /*validRange: function(nowDate) {
			    return {
			      start: nowDate,
			      end: nowDate.clone().add(1, 'months')
			    };
			  }*/

        /*slotLabelFormat: function (date){
				for(var i=0; i<lessonPeriods.length; i++){
					let periodStart = lessonPeriods[i].start.split(":");
					let startHour = periodStart[0];
					if(date.date.hour==parseInt(periodStart[0])&&date.date.minute==parseInt(periodStart[1])){
						return lessonPeriods[i].name;break;
					}
				}

			    return '';
			},*/

        eventClick: function (info) {
          alert("you clicked...");
          //reset student list
          /*$scope.tableDataStudent = [];
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
			    $scope.quizSession = info.event.extendedProps;*/

          //display event details
          $("#event_details").modal({
            backdrop: "static",
            keyboard: true,
            show: true,
          });
        },
        select: function (start, end) {
          // fnGetRootProgs();
          console.log("is it??????");
          console.log(start);
          console.log(start.start);

          console.log(end);

          $("#abc").modal({
            backdrop: "static",
            keyboard: true,
            show: true,
          });
        },
        selectable: true,

        editable: true,
        selectAllow: function (select) {
          //disable select past dates
          return moment().diff(select.start, "days") <= 0;
        },
        resourceAreaHeaderContent: "Phòng",
        resources: $scope.resource1,
        // resources: $scope.roomLists,
        eventSources: [
          {
            events: $scope.events1,
            color: "yellow",
            textColor: "black",
          },
        ],
        // events: $scope.tt_data1
        events: $scope.events1,
      });

      calendar.render();
    }
  },
]);
