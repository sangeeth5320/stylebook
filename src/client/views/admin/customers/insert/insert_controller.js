this.AdminCustomersInsertController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminCustomersInsert': { to: 'AdminSubcontent'}
		
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
			Meteor.subscribe("customers_empty")
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
			customers_empty: Customers.findOne({_id:null}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});