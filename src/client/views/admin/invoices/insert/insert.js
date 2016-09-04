var pageSession = new ReactiveDict();

Template.AdminInvoicesInsert.rendered = function() {
	
};

Template.AdminInvoicesInsert.events({
	
});

Template.AdminInvoicesInsert.helpers({
	
});

Template.AdminInvoicesInsertInsertForm.rendered = function() {
	

	pageSession.set("adminInvoicesInsertInsertFormInfoMessage", "");
	pageSession.set("adminInvoicesInsertInsertFormErrorMessage", "");

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

Template.AdminInvoicesInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminInvoicesInsertInsertFormInfoMessage", "");
		pageSession.set("adminInvoicesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminInvoicesInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminInvoicesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminInvoicesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.invoices.details", {invoiceId: newId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("adminInvoicesInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Invoices.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.AdminInvoicesInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminInvoicesInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminInvoicesInsertInsertFormErrorMessage");
	}, 
	'nextInvoiceNumber': function() { var max = 0; var invoiceNumbers = Invoices.find({}, { fields: { invoiceNumber: 1 }}).fetch(); _.each(invoiceNumbers, function(doc) { var intNum = parseInt(doc.invoiceNumber); if(!isNaN(intNum) && intNum > max) max = intNum; }); return max + 1; }
});
