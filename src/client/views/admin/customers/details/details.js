var pageSession = new ReactiveDict();

Template.AdminCustomersDetails.rendered = function() {
	
};

Template.AdminCustomersDetails.events({
	
});

Template.AdminCustomersDetails.helpers({
	
});

Template.AdminCustomersDetailsDetailsForm.rendered = function() {
	

	pageSession.set("adminCustomersDetailsDetailsFormInfoMessage", "");
	pageSession.set("adminCustomersDetailsDetailsFormErrorMessage", "");

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

Template.AdminCustomersDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminCustomersDetailsDetailsFormInfoMessage", "");
		pageSession.set("adminCustomersDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminCustomersDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(adminCustomersDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminCustomersDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("adminCustomersDetailsDetailsFormErrorMessage", message);
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

		Router.go("admin.customers", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("admin.customers", {});
	}

	
});

Template.AdminCustomersDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminCustomersDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminCustomersDetailsDetailsFormErrorMessage");
	}
	
});
