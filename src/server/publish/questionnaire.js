Meteor.publish("questionnaire_list", function() {
	return Questionnaire.publishJoinedCursors(Questionnaire.find({ownerId:this.userId}, {sort:[["questionnaireId","desc"]]}));
});

Meteor.publish("questionnaire_empty", function() {
	return Questionnaire.publishJoinedCursors(Questionnaire.find({_id:null,ownerId:this.userId}, {}));
});

Meteor.publish("questionnaire_details", function(questionnaireId) {
	return Questionnaire.publishJoinedCursors(Questionnaire.find({_id:questionnaireId,ownerId:this.userId}, {}));
});

