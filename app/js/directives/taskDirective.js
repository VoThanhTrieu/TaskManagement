angular.module('taskModule',[])
.controller('TaskCtrl', ["$scope","$firebaseArray","myService","$filter","$firebaseObject","$rootScope",
	function($scope,$firebaseArray,myService,$filter,$firebaseObject,$rootScope){
				
			//GET SELECTED LIST
			 $scope.$watch("selectedObj", function(newVal) {
			  	$scope.listID = newVal['$id'];
              });



			//Add Task function
			$scope.createDate = new Date().toJSON().slice(0,10);;
			 $scope.addTask = function() {
              if(angular.equals($scope.selectedObj.$id,undefined)){
              	alert("PLease choose a List to add Task");
              }else{
	              var item = {taskName: $scope.taskName,
	                ListId: $scope.listID,
	                dueDate: $scope.selectedTask.dueDate,
	                remindDate: $scope.selectedTask.remindDate,
	                taskNote: $scope.selectedTask.taskNote,
	                taskComment: $scope.selectedTask.taskComment,
	                createDate: $scope.createDate,
	                completed: $scope.selectedTask.completed,
	                starred: $scope.selectedTask.starred,
	            };
	            //ADD TO FIREBASE
	             $scope.tasks.$add(item);
	         }
		   };



		   	//GET SELECTED TASK
		   	$scope.getSelectedTask = function(task){
		   		var ref = new Firebase("https://task-management-app.firebaseio.com/"+$rootScope.loginUser.$id+"/Tasks");
		   		$scope.selectedTask = $firebaseObject(ref.child(task.ListId).child(task.$id));
		   	};

		   	//REMOVE TASK METHOD
		   	$scope.removeTask = function(x){
		   		if(x.$id === undefined){

		   		}else{
		   			myService.removeTask(x);
		   			$scope.selectedTask = $scope.tempTask;
		   		}
		   	};

		   	//Reset Selected Task When focus on Add New Task Input
		   	$scope.resetSlectedTask = function(){
		   	 $scope.selectedTask = {taskName: $scope.tempTask.taskName,
	                ListId: $scope.tempTask.listId,
	                dueDate: $scope.tempTask.dueDate,
	                remindDate: $scope.tempTask.remindDate,
	                taskNote: $scope.tempTask.taskNote,
	                taskComment: $scope.tempTask.taskComment,
	                createDate: $scope.tempTask.createDate,
	                completed: $scope.tempTask.completed,
	                starred: $scope.tempTask.starred,
	                }
		   	}

	   	  //UPDATE TASK METHOD
	      	$scope.updateTask = function(item){
	      		myService.updateTask(item);
		   	};

		   	//SHARE TASK
		   	$scope.shareTask = function(task, email, list){
		   		myService.shareTask(task,email,list);
		   		 $('#btncloseModelShare').click();
		   	}


		   	//SHOW COMPLETED TASKs
		   	$scope.complete = false;
		  	$scope.completeLabel = "SHOW COMPLETED TO-DOs";
		    $scope.showCompletedTask = function(){
	   		/*	myService.showCompletedTask($scope.complete, $scope.completeLabel);*/
	   			if($scope.complete == false){
					   				$scope.complete = true;
					   				$scope.completeLabel = "HIDE COMPLETED TO-DOs";
					   			}
					   			else{
					   				$scope.complete = false;
					   				$scope.completeLabel = "SHOW COMPLETED TO-DOs";
					   			}
	   			};

	   		//SHOW PROPERTIES
	   		$scope.showDetail =  function(){
	   			 $('#Task-Properties').addClass('active');
	   		};

	   		//ORDER METHOD
	   		$scope.orderByMe = function(x){
            	$scope.myOrderBy = x;
            };

}])


.directive('taskcontent',function(){
	return {
		restrict: 'E',
		controller : "TaskCtrl",
		scope:{
			selectedObj: '=',
			selectedTask: '=',
			tasks: '=',
			complete: '=',
			completeLabel: '=',
			dueTask: '=',
			totalTask: '=',
			showToday: '=',
			tempTask: '=',
			loginUser: '=',
			remindedList: '=',
			searchTask: '='
		},
		templateUrl: 'app/html/TaskContent.html'
	};
});