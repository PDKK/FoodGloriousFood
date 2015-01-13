'use strict';

describe('Recipes E2E Tests:', function() {
	describe('Test Recipes page', function() {
		it('Should not include new Recipes', function() {
			browser.get('http://localhost:3000/#!/recipes');
			expect(element.all(by.repeater('recipe in recipes')).count()).toEqual(0);
		});
	});
});
