'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Recipe = mongoose.model('Recipe'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Recipe
 */
exports.create = function(req, res) {
	var recipe = new Recipe(req.body);
	recipe.user = req.user;

	recipe.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipe);
		}
	});
};

/**
 * Show the current Recipe
 */
exports.read = function(req, res) {
	res.jsonp(req.recipe);
};

/**
 * Update a Recipe
 */
exports.update = function(req, res) {
	var recipe = req.recipe ;

	recipe = _.extend(recipe , req.body);

	recipe.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipe);
		}
	});
};

/**
 * Delete an Recipe
 */
exports.delete = function(req, res) {
	var recipe = req.recipe ;

	recipe.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipe);
		}
	});
};

/**
 * List of Recipes
 */
exports.list = function(req, res) { Recipe.find().sort('-created').populate('user', 'displayName').exec(function(err, recipes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(recipes);
		}
	});
};

/**
 * Recipe middleware
 */
exports.recipeByID = function(req, res, next, id) { Recipe.findById(id).populate('user', 'displayName').exec(function(err, recipe) {
		if (err) return next(err);
		if (! recipe) return next(new Error('Failed to load Recipe ' + id));
		req.recipe = recipe ;
		next();
	});
};