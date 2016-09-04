this.AdminInvoicesDetailsController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminInvoicesDetails': { to: 'AdminSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.redirect('admin.invoices.details.items', this.params || {}, { replaceState: true });
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("invoice_details", this.params.invoiceId)
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
			invoice_details: Invoices.findOne({_id:this.params.invoiceId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});