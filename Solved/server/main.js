import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	// code to run on server at startup
	CompletedList = new Mongo.Collection('Completed');
  
});
