var pageSession = new ReactiveDict();

Template.AdminInvoicesDetailsItems.rendered = function() {
	
};

Template.AdminInvoicesDetailsItems.events({
	
});

Template.AdminInvoicesDetailsItems.helpers({
	
});

var AdminInvoicesDetailsItemsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminInvoicesDetailsItemsViewSearchString");
	var sortBy = pageSession.get("AdminInvoicesDetailsItemsViewSortBy");
	var sortAscending = pageSession.get("AdminInvoicesDetailsItemsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["description", "quantity", "price", "amount"];
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

var AdminInvoicesDetailsItemsViewExport = function(cursor, fileType) {
	var data = AdminInvoicesDetailsItemsViewItems(cursor);
	var exportFields = ["description", "quantity", "price", "amount"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminInvoicesDetailsItemsView.rendered = function() {
	pageSession.set("AdminInvoicesDetailsItemsViewStyle", "table");
	
};

Template.AdminInvoicesDetailsItemsView.events({
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
				pageSession.set("AdminInvoicesDetailsItemsViewSearchString", searchString);
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
					pageSession.set("AdminInvoicesDetailsItemsViewSearchString", searchString);
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
					pageSession.set("AdminInvoicesDetailsItemsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.invoices.details.insert", {invoiceId: this.params.invoiceId});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminInvoicesDetailsItemsViewExport(this.invoice_items, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminInvoicesDetailsItemsViewExport(this.invoice_items, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminInvoicesDetailsItemsViewExport(this.invoice_items, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminInvoicesDetailsItemsViewExport(this.invoice_items, "json");
	}

	
});

Template.AdminInvoicesDetailsItemsView.helpers({

	"insertButtonClass": function() {
		return InvoiceItems.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.invoice_items || this.invoice_items.count() == 0;
	},
	"isNotEmpty": function() {
		return this.invoice_items && this.invoice_items.count() > 0;
	},
	"isNotFound": function() {
		return this.invoice_items && pageSession.get("AdminInvoicesDetailsItemsViewSearchString") && AdminInvoicesDetailsItemsViewItems(this.invoice_items).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminInvoicesDetailsItemsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminInvoicesDetailsItemsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminInvoicesDetailsItemsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminInvoicesDetailsItemsViewStyle") == "gallery";
	}

	
});


Template.AdminInvoicesDetailsItemsViewTable.rendered = function() {
	
};

Template.AdminInvoicesDetailsItemsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminInvoicesDetailsItemsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminInvoicesDetailsItemsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminInvoicesDetailsItemsViewSortAscending") || false;
			pageSession.set("AdminInvoicesDetailsItemsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminInvoicesDetailsItemsViewSortAscending", true);
		}
	}
});

Template.AdminInvoicesDetailsItemsViewTable.helpers({
	"tableItems": function() {
		return AdminInvoicesDetailsItemsViewItems(this.invoice_items);
	}
});


Template.AdminInvoicesDetailsItemsViewTableItems.rendered = function() {
	
};

Template.AdminInvoicesDetailsItemsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		InvoiceItems.update({ _id: this._id }, { $set: values });

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
						InvoiceItems.remove({ _id: me._id });
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
		Router.go("invoices.details.edit", {invoiceId: UI._parentData(1).params.invoiceId, itemId: this._id});
		return false;
	}
});

Template.AdminInvoicesDetailsItemsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return InvoiceItems.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return InvoiceItems.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
