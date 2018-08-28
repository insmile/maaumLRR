
'use strict';

// Tasks service used to communicate Tasks REST endpoints

/*
 	$http를 추상화한 $resource
*/
angular.module('tasks').factory('TaskCategory', ['$resource',
	

	function($resource) {
		return {

			categoryBase : $resource('category/:categoryId',
				{categoryId: '@_id'} 
			),
			
			categoryUpdate : $resource('category/update/:_id',
			{_id: '@_id'},
			{
				'update':{method:'get'}
			}),

			categoryRead : $resource('category/read/:categoryId',
			{categoryId: '@_id'},
			{
				'update':{method:'get'}
			})

		};
	}

]);

