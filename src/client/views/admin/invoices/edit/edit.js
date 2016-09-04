var pageSession = new ReactiveDict();

Template.AdminInvoicesEdit.rendered = function() {
	
};

Template.AdminInvoicesEdit.events({
	
});

Template.AdminInvoicesEdit.helpers({
	
});

Template.AdminInvoicesEditEditForm.rendered = function() {
	

	pageSession.set("adminInvoicesEditEditFormInfoMessage", "");
	pageSession.set("adminInvoicesEditEditFormErrorMessage", "");

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

Template.AdminInvoicesEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminInvoicesEditEditFormInfoMessage", "");
		pageSession.set("adminInvoicesEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminInvoicesEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(adminInvoicesEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminInvoicesEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.invoices", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("adminInvoicesEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Invoices.update({ _id: t.data.invoice_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("admin.invoices", {});
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

Template.AdminInvoicesEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminInvoicesEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminInvoicesEditEditFormErrorMessage");
	}
	
});
