var pageSession = new ReactiveDict();

Template.AdminQuestionnaireInsert.rendered = function() {
	
};

Template.AdminQuestionnaireInsert.events({
	
});

Template.AdminQuestionnaireInsert.helpers({
	
});

Template.AdminQuestionnaireInsertInsertForm.rendered = function() {
	

	pageSession.set("adminQuestionnaireInsertInsertFormInfoMessage", "");
	pageSession.set("adminQuestionnaireInsertInsertFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.AdminQuestionnaireInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminQuestionnaireInsertInsertFormInfoMessage", "");
		pageSession.set("adminQuestionnaireInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminQuestionnaireInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminQuestionnaireInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminQuestionnaireInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.questionnaire", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("adminQuestionnaireInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Questionnaire.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("admin.questionnaire", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.AdminQuestionnaireInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminQuestionnaireInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminQuestionnaireInsertInsertFormErrorMessage");
	}
	
});
