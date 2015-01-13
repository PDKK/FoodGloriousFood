'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Recipe = mongoose.model('Recipe'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, recipe;

/**
 * Recipe routes tests
 */
describe('Recipe CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Recipe
		user.save(function() {
			recipe = {
				name: 'Recipe Name'
			};

			done();
		});
	});

	it('should be able to save Recipe instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Recipe
				agent.post('/api/recipes')
					.send(recipe)
					.expect(200)
					.end(function(recipeSaveErr, recipeSaveRes) {
						// Handle Recipe save error
						if (recipeSaveErr) done(recipeSaveErr);

						// Get a list of Recipes
						agent.get('/api/recipes')
							.end(function(recipesGetErr, recipesGetRes) {
								// Handle Recipe save error
								if (recipesGetErr) done(recipesGetErr);

								// Get Recipes list
								var recipes = recipesGetRes.body;

								// Set assertions
								(recipes[0].user._id).should.equal(userId);
								(recipes[0].name).should.match('Recipe Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Recipe instance if not logged in', function(done) {
		agent.post('/api/recipes')
			.send(recipe)
			.expect(403)
			.end(function(recipeSaveErr, recipeSaveRes) {
				// Call the assertion callback
				done(recipeSaveErr);
			});
	});

	it('should not be able to save Recipe instance if no name is provided', function(done) {
		// Invalidate name field
		recipe.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Recipe
				agent.post('/api/recipes')
					.send(recipe)
					.expect(400)
					.end(function(recipeSaveErr, recipeSaveRes) {
						// Set message assertion
						(recipeSaveRes.body.message).should.match('Please fill Recipe name');
						
						// Handle Recipe save error
						done(recipeSaveErr);
					});
			});
	});

	it('should be able to update Recipe instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Recipe
				agent.post('/api/recipes')
					.send(recipe)
					.expect(200)
					.end(function(recipeSaveErr, recipeSaveRes) {
						// Handle Recipe save error
						if (recipeSaveErr) done(recipeSaveErr);

						// Update Recipe name
						recipe.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Recipe
						agent.put('/api/recipes/' + recipeSaveRes.body._id)
							.send(recipe)
							.expect(200)
							.end(function(recipeUpdateErr, recipeUpdateRes) {
								// Handle Recipe update error
								if (recipeUpdateErr) done(recipeUpdateErr);

								// Set assertions
								(recipeUpdateRes.body._id).should.equal(recipeSaveRes.body._id);
								(recipeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Recipes if not signed in', function(done) {
		// Create new Recipe model instance
		var recipeObj = new Recipe(recipe);

		// Save the Recipe
		recipeObj.save(function() {
			// Request Recipes
			request(app).get('/api/recipes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Recipe if not signed in', function(done) {
		// Create new Recipe model instance
		var recipeObj = new Recipe(recipe);

		// Save the Recipe
		recipeObj.save(function() {
			request(app).get('/api/recipes/' + recipeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', recipe.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Recipe instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Recipe
				agent.post('/api/recipes')
					.send(recipe)
					.expect(200)
					.end(function(recipeSaveErr, recipeSaveRes) {
						// Handle Recipe save error
						if (recipeSaveErr) done(recipeSaveErr);

						// Delete existing Recipe
						agent.delete('/api/recipes/' + recipeSaveRes.body._id)
							.send(recipe)
							.expect(200)
							.end(function(recipeDeleteErr, recipeDeleteRes) {
								// Handle Recipe error error
								if (recipeDeleteErr) done(recipeDeleteErr);

								// Set assertions
								(recipeDeleteRes.body._id).should.equal(recipeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Recipe instance if not signed in', function(done) {
		// Set Recipe user 
		recipe.user = user;

		// Create new Recipe model instance
		var recipeObj = new Recipe(recipe);

		// Save the Recipe
		recipeObj.save(function() {
			// Try deleting Recipe
			request(app).delete('/api/recipes/' + recipeObj._id)
			.expect(403)
			.end(function(recipeDeleteErr, recipeDeleteRes) {
				// Set message assertion
				(recipeDeleteRes.body.message).should.match('User is not authorized');

				// Handle Recipe error error
				done(recipeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Recipe.remove().exec();
		done();
	});
});