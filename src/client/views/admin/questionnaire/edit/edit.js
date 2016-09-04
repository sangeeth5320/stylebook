var pageSession = new ReactiveDict();

Template.AdminQuestionnaireEdit.rendered = function() {
	
};

Template.AdminQuestionnaireEdit.events({
	
});

Template.AdminQuestionnaireEdit.helpers({
	
});

Template.AdminQuestionnaireEditEditForm.rendered = function() {
	

	pageSession.set("adminQuestionnaireEditEditFormInfoMessage", "");
	pageSession.set("adminQuestionnaireEditEditFormErrorMessage", "");

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

Template.AdminQuestionnaireEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminQuestionnaireEditEditFormInfoMessage", "");
		pageSession.set("adminQuestionnaireEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminQuestionnaireEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(adminQuestionnaireEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminQuestionnaireEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.questionnaire", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("adminQuestionnaireEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Questionnaire.update({ _id: t.data.questionnaire_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.AdminQuestionnaireEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminQuestionnaireEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminQuestionnaireEditEditFormErrorMessage");
	}
	
});
