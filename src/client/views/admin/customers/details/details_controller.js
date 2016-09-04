this.AdminCustomersDetailsController = RouteController.extend({
	template: "Admin",
	

	yieldTemplates: {
		'AdminCustomersDetails': { to: 'AdminSubcontent'}
		
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
			Meteor.subscribe("customer_details", this.params.customerId),
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
			customer_details: Customers.findOne({_id:this.params.customerId}, {transform:function(doc) { var sum = 0; Invoices.find({ customerId: doc._id }).map(function(item) { sum += item.totalAmount; }); doc.totalAmount = sum; return doc; }}),
			invoice_list: Invoices.find({}, {sort:[["invoiceNumber","desc"]]})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});