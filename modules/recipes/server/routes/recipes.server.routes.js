'use strict';

module.exports = function(app) {
	var recipes = require('../controllers/recipes.server.controller');
	var recipesPolicy = require('../policies/recipes.server.policy');

	// Recipes Routes
	app.route('/api/recipes').all()
		.get(recipes.list).all(recipesPolicy.isAllowed)
		.post(recipes.create);

	app.route('/api/recipes/:recipeId').all(recipesPolicy.isAllowed)
		.get(recipes.read)
		.put(recipes.update)
		.delete(recipes.delete);

	// Finish by binding the Recipe middleware
	app.param('recipeId', recipes.recipeByID);
};