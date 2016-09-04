var pageSession = new ReactiveDict();

Template.AdminInvoicesDetails.rendered = function() {
	
};

Template.AdminInvoicesDetails.events({
	
});

Template.AdminInvoicesDetails.helpers({
	
});

Template.AdminInvoicesDetailsDetailsForm.rendered = function() {
	

	pageSession.set("adminInvoicesDetailsDetailsFormInfoMessage", "");
	pageSession.set("adminInvoicesDetailsDetailsFormErrorMessage", "");

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

Template.AdminInvoicesDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminInvoicesDetailsDetailsFormInfoMessage", "");
		pageSession.set("adminInvoicesDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminInvoicesDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(adminInvoicesDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminInvoicesDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("adminInvoicesDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("admin.invoices", {});
	}

	
});

Template.AdminInvoicesDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminInvoicesDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminInvoicesDetailsDetailsFormErrorMessage");
	}
	
});
