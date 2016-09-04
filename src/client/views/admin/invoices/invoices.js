var pageSession = new ReactiveDict();

Template.AdminInvoices.rendered = function() {
	
};

Template.AdminInvoices.events({
	
});

Template.AdminInvoices.helpers({
	
});

var AdminInvoicesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminInvoicesViewSearchString");
	var sortBy = pageSession.get("AdminInvoicesViewSortBy");
	var sortAscending = pageSession.get("AdminInvoicesViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["invoiceNumber", "date", "customerId", "customer.name", "totalAmount"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var AdminInvoicesViewExport = function(cursor, fileType) {
	var data = AdminInvoicesViewItems(cursor);
	var exportFields = ["invoiceNumber", "date", "customer.name", "totalAmount"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminInvoicesView.rendered = function() {
	pageSession.set("AdminInvoicesViewStyle", "table");
	
};

Template.AdminInvoicesView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("AdminInvoicesViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("AdminInvoicesViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("AdminInvoicesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.invoices.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminInvoicesViewExport(this.invoice_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminInvoicesViewExport(this.invoice_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminInvoicesViewExport(this.invoice_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminInvoicesViewExport(this.invoice_list, "json");
	}

	
});

Template.AdminInvoicesView.helpers({

	"insertButtonClass": function() {
		return Invoices.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.invoice_list || this.invoice_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.invoice_list && this.invoice_list.count() > 0;
	},
	"isNotFound": function() {
		return this.invoice_list && pageSession.get("AdminInvoicesViewSearchString") && AdminInvoicesViewItems(this.invoice_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminInvoicesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminInvoicesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminInvoicesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminInvoicesViewStyle") == "gallery";
	}

	
});


Template.AdminInvoicesViewTable.rendered = function() {
	
};

Template.AdminInvoicesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminInvoicesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminInvoicesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminInvoicesViewSortAscending") || false;
			pageSession.set("AdminInvoicesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminInvoicesViewSortAscending", true);
		}
	}
});

Template.AdminInvoicesViewTable.helpers({
	"tableItems": function() {
		return AdminInvoicesViewItems(this.invoice_list);
	}
});


Template.AdminInvoicesViewTableItems.rendered = function() {
	
};

Template.AdminInvoicesViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("admin.invoices.details", {invoiceId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Invoices.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Invoices.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.invoices.edit", {invoiceId: this._id});
		return false;
	}
});

Template.AdminInvoicesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Invoices.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Invoices.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
