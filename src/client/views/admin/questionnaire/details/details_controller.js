this.AdminQuestionnaireDetailsController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminQuestionnaireDetails': { to: 'AdminSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("Admin"); this.render("loading", { to: "AdminSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("questionnaire_details", this.params.questionnaireId)
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		var data = {
			params: this.params || {},
			questionnaire_details: Questionnaire.findOne({_id:this.params.questionnaireId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});