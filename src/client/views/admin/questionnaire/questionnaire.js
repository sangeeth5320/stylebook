var pageSession = new ReactiveDict();

Template.AdminQuestionnaire.rendered = function() {
	
};

Template.AdminQuestionnaire.events({
	
});

Template.AdminQuestionnaire.helpers({
	
});

var AdminQuestionnaireViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("AdminQuestionnaireViewSearchString");
	var sortBy = pageSession.get("AdminQuestionnaireViewSortBy");
	var sortAscending = pageSession.get("AdminQuestionnaireViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["questionnaireId", "date", "question1", "question2", "question3", "question4", "customerId", "customer.name"];
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

var AdminQuestionnaireViewExport = function(cursor, fileType) {
	var data = AdminQuestionnaireViewItems(cursor);
	var exportFields = ["questionnaireId", "date", "question1", "question2", "question3", "customer.name"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.AdminQuestionnaireView.rendered = function() {
	pageSession.set("AdminQuestionnaireViewStyle", "table");
	
};

Template.AdminQuestionnaireView.events({
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
				pageSession.set("AdminQuestionnaireViewSearchString", searchString);
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
					pageSession.set("AdminQuestionnaireViewSearchString", searchString);
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
					pageSession.set("AdminQuestionnaireViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("admin.questionnaire.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		AdminQuestionnaireViewExport(this.questionnaire_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		AdminQuestionnaireViewExport(this.questionnaire_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		AdminQuestionnaireViewExport(this.questionnaire_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		AdminQuestionnaireViewExport(this.questionnaire_list, "json");
	}

	
});

Template.AdminQuestionnaireView.helpers({

	"insertButtonClass": function() {
		return Questionnaire.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.questionnaire_list || this.questionnaire_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.questionnaire_list && this.questionnaire_list.count() > 0;
	},
	"isNotFound": function() {
		return this.questionnaire_list && pageSession.get("AdminQuestionnaireViewSearchString") && AdminQuestionnaireViewItems(this.questionnaire_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("AdminQuestionnaireViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("AdminQuestionnaireViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("AdminQuestionnaireViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("AdminQuestionnaireViewStyle") == "gallery";
	}

	
});


Template.AdminQuestionnaireViewTable.rendered = function() {
	
};

Template.AdminQuestionnaireViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("AdminQuestionnaireViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("AdminQuestionnaireViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("AdminQuestionnaireViewSortAscending") || false;
			pageSession.set("AdminQuestionnaireViewSortAscending", !sortAscending);
		} else {
			pageSession.set("AdminQuestionnaireViewSortAscending", true);
		}
	}
});

Template.AdminQuestionnaireViewTable.helpers({
	"tableItems": function() {
		return AdminQuestionnaireViewItems(this.questionnaire_list);
	}
});


Template.AdminQuestionnaireViewTableItems.rendered = function() {
	
};

Template.AdminQuestionnaireViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("admin.questionnaire.details", {questionnaireId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Questionnaire.update({ _id: this._id }, { $set: values });

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
						Questionnaire.remove({ _id: me._id });
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
		Router.go("admin.questionnaire.edit", {questionnaireId: this._id});
		return false;
	}
});

Template.AdminQuestionnaireViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Questionnaire.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Questionnaire.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
