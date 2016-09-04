this.AdminQuestionnaireEditController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminQuestionnaireEdit': { to: 'AdminSubcontent'}
		
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
			Meteor.subscribe("customer_list"),
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
			customer_list: Customers.find({}, {transform:function(doc) { var sum = 0; Invoices.find({ customerId: doc._id }).map(function(item) { if(item.totalAmount) sum += item.totalAmount; }); doc.totalAmount = sum; return doc; },sort:["name"]}),
			questionnaire_details: Questionnaire.findOne({_id:this.params.questionnaireId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});