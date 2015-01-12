'use strict';


module.exports = {
	app: {
		title: 'FoodGloriousFood',
		description: 'MEAN Stack Recipe Store',
		keywords: 'MEAN Recipe',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions'
};
