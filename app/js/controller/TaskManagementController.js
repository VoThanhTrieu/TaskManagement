 app.controller("TaskManagementCtrl",["$scope","$rootScope","$firebaseArray","$timeout","$filter","$interval","myService","$firebaseObject",
 	function($scope,$rootScope,$firebaseArray,$timeout,$filter,$interval,myService,$firebaseObject){
 				$rootScope.Lists = [];
				$scope.listName = "";
				$scope.ownerId = "";
				$scope.selectedObj = {};
				$scope.Tasks = [];
				$scope.tempTask = {
						taskName: "",
		                ListId: "",
		                dueDate: $filter('date')(new Date(), 'M/dd/yyyy h:mm a'),
		                remindDate: $filter('date')(new Date(), 'M/dd/yyyy h:mm a'),
		                taskNote: "",
		                taskComment: "",
		                createDate: "",
		                completed: "false",
		                starred: "false"
				};
				$scope.selectedTask = $scope.tempTask;
				$rootScope.loginUser = {
							$id: "",
							Email: "",
							Password: ""
						};

			//GET TASK AS ARRAY
			$rootScope.LoadTasks = function(){
	          	var today = new Date().toJSON().slice(0,10);
	        	var taskUrl = new Firebase("https://task-management-app.firebaseio.com/"+$rootScope.loginUser.$id+"/Tasks");
	       		$scope.totalTask = $firebaseObject(taskUrl);
	       		$scope.totalTask.$watch(function(){
	       			$scope.todayTask = [];
					$scope.countTask = [];
					angular.forEach($scope.totalTask, function(obj) {
	          			angular.forEach(obj, function(value, key){
	          				/*var getListUrl = new Firebase("https://task-management-app.firebaseio.com/"+$rootScope.loginUser.$id+"/Lists");
	          				var getList = $firebaseObject(getListUrl.child(value.ListId));
	          				getList.$loaded(function(){*/
	          					var item = {
		          					$id 		: key,
		          					taskName 	: value.taskName,
					                ListId 		: value.ListId,
					               /* listName 	: getList.listName,*/
					                dueDate 	: value.dueDate,
					                remindDate 	: value.remindDate,
					                taskNote 	: value.taskNote,
					                taskComment : value.taskComment,
					                createDate 	: value.createDate,
					                completed 	: value.completed,
					                starred 	: value.starred,
					            };
					          
					            $scope.countTask.push(item);
								if (new Date(item.dueDate).toJSON().slice(0,10) == today){
									$scope.todayTask.push(item);
				   				};
	          				/*});*/

	          			});
	       			});
				});
	       	};


		   	//REMIDER FUNCTION
		   	$scope.dueTask = [];
		   	$scope.remindedList = [];
		   	$scope.Reminder = function(){
		   		var date = new Date();
		   		$scope.currentTime = $filter('date')(new Date(), 'M/dd/yyyy h:mm a');
				   			angular.forEach($scope.countTask,function(subrec){
				   					var rm = new Date(subrec.remindDate);
				   					var cr =  new Date($scope.currentTime);

				   						if((cr -rm) > 0 && (cr -rm) <= 60000){
				   							$scope.dueTask.push(subrec);
				   							$scope.remindedList.push(subrec);
					   					};
		   			});

		   	};

		   	 $interval( function(){ $scope.Reminder(); }, 60000,false);


		   	//REMOVE LIST METHOD
		   $scope.removeList = function(list){
		   		myService.removeList(list);
		   		$scope.selectedObj = {};
		   		$scope.Tasks = [];
		   		$scope.selectedTask = $scope.tempTask;
		   };

		   	//Remove Task from reminded Task when losing alert
		   	$scope.closeRemindAlert = function(index){
		   		$scope.dueTask.splice(index,1);
		   };

 }]);
