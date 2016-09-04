this.AdminInvoicesController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminInvoices': { to: 'AdminSubcontent'}
		
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
			Meteor.subscribe("invoice_list")
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
			invoice_list: Invoices.find({}, {sort:[["invoiceNumber","desc"]]})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});