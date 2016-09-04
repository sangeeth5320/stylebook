this.AdminInvoicesDetailsInsertController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminInvoicesDetailsInsert': { to: 'AdminInvoicesDetailsSubcontent'},
		'AdminInvoicesDetails': { to: 'AdminSubcontent'}
		
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
			Meteor.subscribe("invoice_items_empty"),
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
			invoice_items_empty: InvoiceItems.findOne({_id:null}, {}),
			invoice_details: Invoices.findOne({_id:this.params.invoiceId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});