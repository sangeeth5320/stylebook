this.AdminQuestionnaireController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminQuestionnaire': { to: 'AdminSubcontent'}
		
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
			Meteor.subscribe("questionnaire_list")
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
			questionnaire_list: Questionnaire.find({}, {sort:[["questionnaireId","desc"]]})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});