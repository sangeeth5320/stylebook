var pageSession = new ReactiveDict();

Template.AdminCustomers.rendered = function() {
	
};

Template.AdminCustomers.events({
	
});

Template.AdminCustomers.helpers({
	
});

var AdminCustomersViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminCustomersViewSearchString");
	var sortBy = pageSession.get("AdminCustomersViewSortBy");
	var sortAscending = pageSession.get("AdminCustomersViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "phone", "email", "note", "totalAmount", "active"];
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

var AdminCustomersViewExport = function(cursor, fileType) {
	var data = AdminCustomersViewItems(cursor);
	var exportFields = ["name", "phone", "email", "note", "totalAmount"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminCustomersView.rendered = function() {
	pageSession.set("AdminCustomersViewStyle", "table");
	
};

Template.AdminCustomersView.events({
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
				pageSession.set("AdminCustomersViewSearchString", searchString);
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
					pageSession.set("AdminCustomersViewSearchString", searchString);
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
					pageSession.set("AdminCustomersViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.customers.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminCustomersViewExport(this.customer_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminCustomersViewExport(this.customer_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminCustomersViewExport(this.customer_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminCustomersViewExport(this.customer_list, "json");
	}

	
});

Template.AdminCustomersView.helpers({

	"insertButtonClass": function() {
		return Customers.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.customer_list || this.customer_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.customer_list && this.customer_list.count() > 0;
	},
	"isNotFound": function() {
		return this.customer_list && pageSession.get("AdminCustomersViewSearchString") && AdminCustomersViewItems(this.customer_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminCustomersViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminCustomersViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminCustomersViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminCustomersViewStyle") == "gallery";
	}

	
});


Template.AdminCustomersViewTable.rendered = function() {
	
};

Template.AdminCustomersViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminCustomersViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminCustomersViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminCustomersViewSortAscending") || false;
			pageSession.set("AdminCustomersViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminCustomersViewSortAscending", true);
		}
	}
});

Template.AdminCustomersViewTable.helpers({
	"tableItems": function() {
		return AdminCustomersViewItems(this.customer_list);
	}
});


Template.AdminCustomersViewTableItems.rendered = function() {
	
};

Template.AdminCustomersViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("admin.customers.details", {customerId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Customers.update({ _id: this._id }, { $set: values });

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
						Customers.remove({ _id: me._id });
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
		Router.go("admin.customers.edit", {customerId: this._id});
		return false;
	}
});

Template.AdminCustomersViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Customers.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Customers.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
