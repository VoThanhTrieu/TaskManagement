app.service('myService',["$firebaseArray","$firebaseObject","$rootScope",function($firebaseArray,$firebaseObject,$rootScope){
				this.showCompletedTask = function(complete,completeLabel){
		  			if(complete = "false"){
					   				complete = "true";
					   				completeLabel = "SHOW UNCOMPLETED TO-DOs";
					   			}
					   			else{
					   				complete = "false";
					   				completeLabel = "SHOW COMPLETED TO-DOs";
					   			}
					   		return complete, completeLabel;
		  		};

		  		this.updateTask = function(m_task){
		  				var updateTaskUrl = new Firebase("https://task-management-app.firebaseio.com/"+$rootScope.loginUser.$id+"/Tasks/"+ m_task.ListId);
		  				var updatedTaskList = $firebaseArray(updateTaskUrl);
		  				updatedTaskList.$loaded().then(function(){
		  					var updatedTask = updatedTaskList.$getRecord(m_task.$id);

		  					updatedTask.taskName 	= 	m_task.taskName;
			                updatedTask.ListId 		= 	m_task.ListId;
			                updatedTask.dueDate 	= 	m_task.dueDate;
			                updatedTask.remindDate 	= 	m_task.remindDate;
			                updatedTask.taskNote 	= 	m_task.taskNote;
			                updatedTask.taskComment = 	m_task.taskComment;
			                updatedTask.createDate	= 	m_task.createDate;
			                updatedTask.completed 	= 	m_task.completed;
			                updatedTask.starred 	= 	m_task.starred;

          					updatedTaskList.$save(updatedTask);
		  				});
		  		};

		  		this.removeTask = function(m_task){
		  			var ref = new Firebase("https://task-management-app.firebaseio.com/"+$rootScope.loginUser.$id+"/Tasks");
		  			var deletedTask = $firebaseObject(ref.child(m_task.ListId).child(m_task.$id));
		  			deletedTask.$remove();
		  		};

		  		this.removeList = function(m_list){
		  			var deletetaskUrl = new Firebase("https://task-management-app.firebaseio.com/"+$rootScope.loginUser.$id+"/Tasks/"+m_list.$id);
					var deletedtasks = $firebaseArray(deletetaskUrl);
					deletedtasks.$loaded().then(function(){
							//REMOVE TASK IN DELETED LIST
					   angular.forEach(deletedtasks,function(rec){
					   		deletedtasks.$remove(rec);
					   });
		       		});
		  			var ref = new Firebase("https://task-management-app.firebaseio.com/"+$rootScope.loginUser.$id+"/Lists");
		  			var removedList = $firebaseObject(ref.child(m_list.$id));
		  			removedList.$remove();
		  		};

		  		this.updateList = function(m_selectedlist, m_renamedlist){
		  			var ref = new Firebase("https://task-management-app.firebaseio.com/"+$rootScope.loginUser.$id+"/Lists");
		  			var updatedList = $firebaseObject(ref.child(m_selectedlist.$id));
		  			updatedList.listName = m_renamedlist.listName;
		  			updatedList.ownerId = m_renamedlist.ownerId;
		  			updatedList.$save();
		  		};

		  		this.shareTask = function(m_task, email,m_list){
		  			var refUser = new Firebase("https://task-management-app.firebaseio.com/Users");
		  			var userList = $firebaseObject(refUser);
		  			var sharedUser = {};
		  			userList.$loaded(function(){
		  				angular.forEach(userList, function(value, key){
		  					if (value.Email == email) {
		  						sharedUser = {
		  							$id: key,
		  							Email: value.Email,
		  							Password: value.Password
		  						};
		  					};
		  				});

		  				if(typeof Object.keys(sharedUser)[0] === 'undefined'){
		  					alert(email + " has not been signed up yet! Shearing task unsuccessfully!");
		  				}
		  				else{
		  				
		  					var refList = new Firebase("https://task-management-app.firebaseio.com/"+sharedUser.$id+"/Lists");
				  			var share_lists = $firebaseArray(refList);
				  			var shareList = {};
							share_lists.$loaded(function(){
								
								angular.forEach(share_lists,function(list){
									if(angular.isObject(list)){
										if(list.listName == m_list.listName){
											shareList = {
												$id: list.$id,
												listName: list.listName,
												ownerId: list.ownerId
											};
										};
									};
								});

								if(typeof Object.keys(shareList)[0] === 'undefined'){
									var refNewList = new Firebase("https://task-management-app.firebaseio.com/"+sharedUser.$id+"/Lists");
				  					var shareNewLists = $firebaseArray(refNewList);
				  					var newList = {
				  						listName: m_list.listName,
				  						ownerId: email
				  					};
				  					shareNewLists.$add(newList);
				  					shareNewLists.$loaded(function(){
				  							var refNewList_1 = new Firebase("https://task-management-app.firebaseio.com/"+sharedUser.$id+"/Lists");
					  						var shareNewLists_1 = $firebaseArray(refNewList_1);
								  			shareNewLists_1.$loaded(function(){
												angular.forEach(shareNewLists_1,function(list){
													if(angular.isObject(list)){
														if(list.listName == m_list.listName){
															shareList = {
																$id: list.$id,
																listName: list.listName,
																ownerId: list.ownerId
															};
														};
													};
												});
												var reftask = new Firebase("https://task-management-app.firebaseio.com/"+sharedUser.$id+"/Tasks/"+shareList.$id);
												var shareTasks = $firebaseArray(reftask);
												shareTasks.$loaded(function(){
													m_task.ListId = shareList.$id;
													shareTasks.$add(m_task);
													alert("share Task "+ m_task.taskName+" Successfully!");
												});
						  					});
										});
								}
								else{
										var reftask = new Firebase("https://task-management-app.firebaseio.com/"+sharedUser.$id+"/Tasks/"+shareList.$id);
										var shareTasks = $firebaseArray(reftask);
										shareTasks.$loaded(function(){
											m_task.ListId = shareList.$id;
											shareTasks.$add(m_task);
											alert("share Task "+ m_task.taskName+" Successfully!");
										});
									}
				  			});
						}
		  			});
		  		};

}]);
