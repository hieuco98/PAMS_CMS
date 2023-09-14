angular
.module('PAMSapp')
.controller('mdashController', 
		['$rootScope', '$scope', '$window', '$interval', '$location', '$localStorage', '$filter', 'mdashService', 'NgTableParams','$cookies',
		 function ($rootScope, $scope, $window, $interval, $location, $localStorage, $filter, mdashService, NgTableParams,$cookies) {
	
	//=============================================================================
	(function initController() {
		// $rootScope.focus_controller="MANAGERDASHBOARD";
	
    	})();

    	//--------------------------------------------------------------------------------------
	function fnGetManagerDashboardCounter(term_id){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.term_id = term_id;
		
		console.log(reqData);
		mdashService.GetManagerDashboardCounterApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				
				$scope.counters=respData;
	            // amchartdiv_class_interactive.data=respData.class_interactive_list;
			}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}else{
				alert("fnGetManagerDashboardCounter: Lỗi server!");
			} 
		});
	}

    	function termList(){
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
 	    	mdashService.TermlistApi(reqData, function (respData) {
	    		if (respData.code == 200) {
	    			console.log(respData);
					if(respData.term_list.length>0){
						$scope.terms = respData.term_list;
						var found = 0;
						for(var i=0; i<$scope.terms.length; i++){
							if($scope.terms[i].is_current==1) {
								$scope.selectedTerm = $scope.terms[i];
								found = 1;
								break;
							}
						}
						if(found==0) $scope.selectedTerm = $scope.terms[0];
						$cookies.put('current_term_id',$scope.selectedTerm.id);
						console.log($cookies.get('current_term_id'));
						fnGetManagerDashboardCounter($scope.selectedTerm.id);
					}else{
						Swal.fire({
						  type: 'info',
						  title: 'Chưa có học kỳ',
						  text: 'Cần thiết lập học kỳ trước khi tiếp tục.'
						})
						$location.path('/m_setup');
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
					  title: 'Lỗi termList',
					  text: respData.description
					})
	    		}
	    	});
	}

	//--------------------------------------------------------------------------------------
	$scope.last_feedback_id=0;
	function fnGetNewFeedback(){
		//feedback_counter, new comment list and averagerate
		var reqData = {};
		reqData.session_id = $cookies.get('session_id');
		reqData.last_feedback_id = $scope.last_feedback_id;
		
		console.log(reqData);
		mdashService.GetRealtimeFeebackCounterApi(reqData, function (respData) {
			console.log(respData);
			if(respData.code == 200 ) {
				
				$scope.fb_counters=respData;
				
				google_gauge_data= google.visualization.arrayToDataTable([
					['Label', 'Value'],
					['01', respData.feedback_average_value]
					
					]);			
				
				google_gauge_chart = new google.visualization.Gauge(document.getElementById('google_gauge_chart_div'));
				google_gauge_chart.draw(google_gauge_data, google_gauge_options);

				
				for(i=0;i<respData.comment_list.length;i++){
            	   //addEvent(Math.floor(Math.random() * 4)+1,"evt_name","user_name","created_time");
					addEvent(Math.floor(Math.random() * 4)+1,respData.comment_list[i].comment,
						respData.comment_list[i].user_name,respData.comment_list[i].created_time);
					$scope.last_feedback_id=respData.comment_list[i].id;
				}
				
				
				
				
			}else if(respData.code == 700){
				Swal.fire({
					  type: 'error',
					  title: 'Phiên đăng nhập của bạn đã kết thúc.',
					  text: 'Xin mời đăng nhập lại để tiếp tục sử dụng dịch vụ.'
					})
				$location.path('/login');
			}  else{
				alert("fnGetManagerDashboardCounter: Lỗi server!");
			} 
		});
	}
	
	//------------------for Google GAUGE google_gauge_chart_div--------------
	var google_gauge_data={};
	var google_gauge_chart;
	var google_gauge_options={};
	
	function drawChart_google_gauge() {
		google_gauge_options = {
			width: 180, height: 180,
			greenFrom: 80, greenTo: 100,
			yellowFrom:30, yellowTo: 80,
			redFrom:0, redTo: 30,
			minorTicks: 5,
			max :100
        };

        google_gauge_data= google.visualization.arrayToDataTable([
             ['Label', 'Value'],
             ['01', 70]
            
        ]);			
        
        google_gauge_chart = new google.visualization.Gauge(document.getElementById('google_gauge_chart_div'));
        google_gauge_chart.draw(google_gauge_data, google_gauge_options);
  
      }
	
	//------------------SLIM SCROLLL--------------------------------------

	$scope.pending_task=0;
	
	function addEvent(event_id, event_name,user_name,created_time){
		var itemContainer = $("#item-container");
		var content='?';
		
		switch (event_id){
			case 1://login
				content=''+
		        '<div class="col1">'+
		            '<div class="cont">'+
		                '<div class="cont-col1">'+
		                    '<div class="label label-sm label-success">'+
		                        '<i class="fa fa-comment"></i>'+
		                    '</div>'+
		                '</div>'+
		                '<div class="cont-col2">'+
		                    '<div class="desc">'+created_time+':'+user_name+'--> '+event_name+'. </div>'+
		                '</div>'+
		            '</div>'+
		        '</div>'+
		        '<div class="col2">'+
		            '<div class="date">'+''+ '</div>'+
		        '</div>';
				
				break;
			case 2://logout
				content=''+
		        '<div class="col1">'+
		            '<div class="cont">'+
		                '<div class="cont-col1">'+
		                    '<div class="label label-sm label-danger">'+
		                        '<i class="fa fa-commenting"></i>'+
		                    '</div>'+
		                '</div>'+
		                '<div class="cont-col2">'+
		                    '<div class="desc">'+created_time+':'+user_name+'--> '+event_name+'. </div>'+
		                '</div>'+
		            '</div>'+
		        '</div>'+
		        '<div class="col2">'+
		            '<div class="date">'+''+ '</div>'+
		        '</div>';
		  
				break;
			case 3://input kpi data
				content=''+
		        '<div class="col1">'+
		            '<div class="cont">'+
		                '<div class="cont-col1">'+
		                    '<div class="label label-sm label-success">'+
		                        '<i class="fa fa-rss"></i>'+
		                    '</div>'+
		                '</div>'+
		                '<div class="cont-col2">'+
		                    '<div class="desc">'+created_time+':'+user_name+'--> '+event_name+'</div>'+
		                '</div>'+
		            '</div>'+
		        '</div>'+
		        '<div class="col2">'+
		            '<div class="date"> '+''+' </div>'+
		        '</div>';
				break;
			case 4://edit kpi data
				content=''+
		        '<div class="col1">'+
		            '<div class="cont">'+
		                '<div class="cont-col1">'+
		                    '<div class="label label-sm label-warning">'+
		                        '<i class="fa fa-plus"></i>'+
		                    '</div>'+
		                '</div>'+
		                '<div class="cont-col2">'+
		                    '<div class="desc">'+created_time+':'+user_name+'--> '+event_name+' </div>'+
		                '</div>'+
		            '</div>'+
		        '</div>'+
		        '<div class="col2">'+
		            '<div class="date"> '+''+' </div>'+
		        '</div>';
				break;
			case 5://input cycle start
				break;
			case 6://input cycle finish
				break;
			default:
		}
			
	
		itemContainer.append("<li>" + content + "</li>");
        
        //-------------------------------------------------------
        var scrollTo_int = itemContainer.prop('scrollHeight') + 'px';
        
       /* itemContainer.slimScroll({
            scrollTo : scrollTo_int,
            height: '200px',
            start: 'top',
            alwaysVisible: true
        });*/
	}
	//------------------------------------------------------------------------
	$(document).ready(function() {
	    var itemContainer = $("#item-container");
	    
	    itemContainer.slimScroll({
	        height: '250px',
	        start: 'top',
	        alwaysVisible: true
	    });
	    
	    $("#add-btn").click(function() {
	    	
	        var newInput= $("#add-input");
	        if( newInput.val() !== "") {
	            //itemContainer.append("<li>" + newInput.val() + "</li>");
	            newInput.val('');
	            
	            //-------------------------------------------------------
	           
	            var content=''+
	            '<div class="col1">'+
	                '<div class="cont">'+
	                    '<div class="cont-col1">'+
	                        '<div class="label label-sm label-info">'+
	                            '<i class="fa fa-check"></i>'+
	                        '</div>'+
	                    '</div>'+
	                    '<div class="cont-col2">'+
	                        '<div class="desc"> You have 4 pending tasks.'+
	                            '<span class="label label-sm label-warning "> Take action'+
	                                '<i class="fa fa-share"></i>'+
	                            '</span>'+
	                        '</div>'+
	                    '</div>'+
	                '</div>'+
	            '</div>'+
	            '<div class="col2">'+
	                '<div class="date"> Just now </div>'+
	            '</div>';
	            
	            itemContainer.append("<li>" + content + "</li>");
	            content=''+
	            '<a href="javascript:;">'+
	                '<div class="col1">'+
	                    '<div class="cont">'+
	                        '<div class="cont-col1">'+
	                            '<div class="label label-sm label-success">'+
	                                '<i class="fa fa-bar-chart-o"></i>'+
	                            '</div>'+
	                        '</div>'+
	                        '<div class="cont-col2">'+
	                            '<div class="desc"> Finance Report for year 2013 has been released. </div>'+
	                        '</div>'+
	                    '</div>'+
	                '</div>'+
	                '<div class="col2">'+
	                    '<div class="date"> 20 mins </div>'+
	                '</div>'+
	            '</a>';
	            
	            
	            itemContainer.append("<li>" + content + "</li>");
	            
	            
	            content=''+
                '<div class="col1">'+
                    '<div class="cont">'+
                        '<div class="cont-col1">'+
                            '<div class="label label-sm label-warning">'+
                                '<i class="fa fa-bell-o"></i>'+
                            '</div>'+
                        '</div>'+
                        '<div class="cont-col2">'+
                            '<div class="desc"> Web server hardware needs to be upgraded.'+
                                '<span class="label label-sm label-default "> Overdue </span>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div class="col2">'+
                    '<div class="date"> 2 hours </div>'+
                '</div>';
          
            	///itemContainer.append("<li>" + content + "</li>");
            
	            //-------------------------------------------------------
	            var scrollTo_int = itemContainer.prop('scrollHeight') + 'px';
	            
	            itemContainer.slimScroll({
	                scrollTo : scrollTo_int,
	                height: '250px',
	                start: 'top',
	                alwaysVisible: true
	            });
	        }
	        //--------------------------
	        
	    });
	});
}]);