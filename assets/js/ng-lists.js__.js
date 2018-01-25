


app.controller('list-single', function ($scope, $routeParams, $route, $rootScope, $location, $timeout, $firebaseObject, $firebaseArray) {
	
	// routeParams
	$scope.p = $routeParams.p;
	$scope.p = $routeParams.p;

	//clutter
	$scope.clutter = true;

	// get list
	$scope.get_list = function(id) {
		// console.log('get_list',id)
		var ref = firebase.database().ref().child('lists/'+id);
		var a = "activeList"
		$scope.bugs_obj = $firebaseObject(ref);
		$scope.bugs = $firebaseArray(ref);

		$scope.setActiveList(id, a);

		// dates to integers anf default order param
		$scope.bugs.$loaded().then( function(bugs){
			$scope.get_points($scope.bugs);
		});
	};

	//get points for current list (bugs)
	$scope.get_points = function(bugs) {
	$timeout(function(){
		var total = 0;
		var f_total = 0;
		angular.forEach(bugs, function (bug) {
			bug.date = parseFloat(bug.date);
			if($.isNumeric(bug.weight)){ 
				total=total+parseFloat(bug.weight);
				if(bug.finished){
					f_total=f_total+parseFloat(bug.weight);
				}
			}
		});
		if(typeof $scope.bugs_obj['point'] == 'undefined'){ $scope.bugs_obj['point']={}};
		$scope.bugs_obj.point['total']=total;
		$scope.bugs_obj.point['completed']=f_total;
		var val = $scope.bugs_obj.point['percent']=Math.floor((f_total/total)*100);
		$scope.bugs_obj.$save();
		$scope.bug_sort('order');
		$scope.bug_sort('order');
		$scope.animate_number(val)
	},500);
	};
	
	// animate number
	$scope.animate_number = function(val) {
		var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
		$('#SCORE').animateNumber({
		    number: val
		  }
		);
	}

	// sort bugs
	$scope.bug_sort = function(val) {
		// console.log(val+" "+$scope.orderby);

	   	$scope.orderby = val;
	   	$scope.revv = !$scope.revv;
	   // return card.values.opt1 + card.values.opt2;
	};
	
	//datepicker
	$scope.datepicker = function(id) {
		$scope.bugs.$loaded().then( function(){
			var picker = $( "#datepicker_"+id)
			$scope.picker = picker.datepicker({
		      showOtherMonths: true,
		      selectOtherMonths: true,
		      // dateFormat: "M dd yy",
		      dateFormat: "@",
		      onSelect: function() {
			    $(this).change();
			    angular.element($(this)).triggerHandler('change');
			  }
		    });
		});
	};




	//change priority
	$scope.priority = function(bug,val,wt) {
		bug.priority=val;
		bug.weight=wt;
		$scope.bugs.$save(bug);
	};

	// Set Active and List Name
	$scope.setActiveList = function(id, a) {
		var el = $('[item-id="'+id+'"]');
		var name = el.text().trim().toString();
		$('.'+a).removeClass(a);
		el.addClass(a);

		// make sure
		$timeout(function(){
			if(!$('.'+a).length){
				// console.log('there was no active class... trying again');
				$scope.setActiveList(id, a);
			}
			// console.log("LIST_obj: ", $scope.bugs_obj);
			// console.log("LIST: ", $scope.bugs);
		},2000);
		$scope.bugs['name'] = name;
		// $scope.bugs.$save(); no need to save to FB cause it will change everytime
	};


	//drag to sort
	$scope.sort_bugs = function() {
		// console.log('sort_bugs*****');
		$timeout( function(){
		$( ".sort_bugs" ).sortable({
			revert: true,
			cancel: '.addForm',
			handle: '.ellipsiss',
			start: function(event, ui) {
				var start_pos = ui.item.index();
				var start_group_id = ui.item.closest('ul').attr('id');
				ui.item.data('start_pos', start_pos);
				ui.item.data('start_group_id', start_group_id);
				// console.log(start_group_id)
			},
			stop: function (event, ui) {
				var
				       start_pos = ui.item.data('start_pos'),
				         end_pos = ui.item.index(),
				  start_group_id = ui.item.data('start_group_id'),
				   stop_group_id = ui.item.closest('ul').attr('id'),
				            item = {}
				         item.id = ui.item.attr('item-id'),
				      item.order = ui.item.attr('item-order'),
				       item.name = ui.item.attr('item-name'),
				           items = $('.sort_bugs .bug-cols').not( ".addForm" )
				;
				console.log(ui.item)
				console.log(item)
				// console.log( 'start_group_id: '+start_group_id, '// stop_group_id: '+stop_group_id)
				items.each( function(e) {
				 	var indx = $(this).index()+1;
				 	$(this).attr('data-order',indx);
				 	$(this).find('span.XX').html(indx);
				 	$(this).find('input.order').val(indx);
				});
				$timeout( function(){
		 			angular.element($('.sort_bugs .bug-cols').find('input.order')).triggerHandler('change');
		 			if(stop_group_id !== start_group_id){
		 				console.log('insert group change logic here');
		 				// add to stop_group
		 				$rootScope['list_'+stop_group_id+'_obj'][item.id]=item;
						$rootScope['list_'+stop_group_id+'_obj'].$save();
						// remove from start group
						$rootScope['list_'+start_group_id+'_obj'][item.id]={};
						$rootScope['list_'+start_group_id+'_obj'].$save();
		 			}
				},300);
			}
		});
		},1000);
	}

});























app.controller('department_nav', function ($scope, $routeParams, $route, $rootScope, $location, $timeout, $firebaseObject, $firebaseArray) {
	
	// departments
	$timeout(function() {
		// console.log('here: ',$rootScope.u.uid);
		var ref = firebase.database().ref('profiles').child('/departments');
		$scope.departments_obj = $firebaseObject(ref);
		$rootScope.departments = $firebaseArray(ref);
	}, 1000);


	$scope.name4repeat = function(id) {
		// console.log('name4repeat',$rootScope['list_'+id]);
		return $rootScope['list_'+id];
	}


	$scope.sort_lists = function() {
		// console.log('bugs');
		$( ".sort_lists" ).sortable({
			revert: true,
			cancel: '.addForm',
			connectWith: ".sort_lists",
			start: function(event, ui) {
				var start_pos = ui.item.index();
				var start_group_id = ui.item.closest('ul').attr('id');
				ui.item.data('start_pos', start_pos);
				ui.item.data('start_group_id', start_group_id);
				// console.log(start_group_id)
			},
			stop: function (event, ui) {
				var
				       start_pos = ui.item.data('start_pos'),
				         end_pos = ui.item.index(),
				  start_group_id = ui.item.data('start_group_id'),
				   stop_group_id = ui.item.closest('ul').attr('id'),
				            item = {}
				         item.id = ui.item.attr('item-id'),
				      item.order = ui.item.attr('item-order'),
				       item.name = ui.item.attr('item-name'),
				           items = $('.sort_lists li').not( ".addForm" )
				;
				console.log(ui.item)
				console.log(item)
				// console.log( 'start_group_id: '+start_group_id, '// stop_group_id: '+stop_group_id)
				items.each( function(e) {
				 	var indx = $(this).index()+1;
				 	$(this).attr('data-order',indx);
				 	$(this).find('span.XX').html(indx);
				 	$(this).find('input.order').val(indx);
				});
				$timeout( function(){
		 			angular.element($('.sort_lists li').find('input.order')).triggerHandler('change');
		 			if(stop_group_id !== start_group_id){
		 				console.log('insert group change logic here');
		 				// add to stop_group
		 				$rootScope['list_'+stop_group_id+'_obj'][item.id]=item;
						$rootScope['list_'+stop_group_id+'_obj'].$save();
						// remove from start group
						$rootScope['list_'+start_group_id+'_obj'][item.id]={};
						$rootScope['list_'+start_group_id+'_obj'].$save();
		 			}
				},300);
			}
		});
	}

	$scope.sort_groups = function() {
		$timeout( function(){
			$( ".sort_groups" ).sortable({
				revert: true,
				handle: 'i.fa-ellipsis-v',
				start: function(event, ui) {
				},
				stop: function (event, ui) {
				}
			});
		},1000);
	}

	$scope.getsortorder = function() {
		console.log('getsortorder');
	}


	// departments list
	$scope.new_list = function(id, name) {
		console.log('id',id)
		console.log('name',name)
		var ref = firebase.database().ref().child('group_lists/list_'+id);
		$rootScope['list_'+id+'_obj'] = $firebaseObject(ref);
		$rootScope['list_'+id] = $firebaseArray(ref);
		// $rootScope.lists.$loaded().then(function(data){
		// 	console.log(data);
		// })
		$rootScope['list_'+id].$add({
		    name: name
		});
		$('.l_name').val('');
	};

	// departments list
	$scope.get_lists = function(id) {
		// console.log('get_list',id)
		var ref = firebase.database().ref().child('group_lists/list_'+id);
		$rootScope['list_'+id+'_obj'] = $firebaseObject(ref);
		$rootScope['list_'+id] = $firebaseArray(ref);
		$scope.floats(id);
	};
	
	$scope.floats = function(id) {
		$rootScope['list_'+id].$loaded().then( function(group){
			angular.forEach(group, function (list) {
			  list.order = parseFloat(list.order);
			});
		});
	}

	// departments data
	$scope.new_department = function() {
		console.log('clicked')
		$rootScope.departments.$add({
		    name: $scope.d_name
		    // slug: "untitled"
		});
		$('#d_name').val('');
	};
	

	$scope.guts = function(id) {
		console.log("#"+id)
		var guts = $("#"+id);
		var addForm = guts.next('.addForm');
		if(guts.hasClass('open')){
			guts.removeClass('open');
			addForm.hide();
			return false;
		}
		guts.addClass('open');
		addForm.show();
	};
});


















