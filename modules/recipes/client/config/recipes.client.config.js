'use strict';

// Configuring the Recipes module
angular.module('recipes').run(['Menus',
	function(Menus) {
		// Add the Recipes dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Recipes',
			state: 'recipes',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'recipes', {
			title: 'List Recipes',
			state: 'recipes.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'recipes', {
			title: 'Create Recipe',
			state: 'recipes.create'
		});
	}
]);