this.Questionnaire = new Mongo.Collection("questionnaire");

this.Questionnaire.userCanInsert = function(userId, doc) {
	return true;
};

this.Questionnaire.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Questionnaire.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
