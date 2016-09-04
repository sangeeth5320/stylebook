var pageSession = new ReactiveDict();

Template.AdminCustomersInsert.rendered = function() {
	
};

Template.AdminCustomersInsert.events({
	
});

Template.AdminCustomersInsert.helpers({
	
});

Template.AdminCustomersInsertInsertForm.rendered = function() {
	

	pageSession.set("adminCustomersInsertInsertFormInfoMessage", "");
	pageSession.set("adminCustomersInsertInsertFormErrorMessage", "");

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

Template.AdminCustomersInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminCustomersInsertInsertFormInfoMessage", "");
		pageSession.set("adminCustomersInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminCustomersInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(adminCustomersInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminCustomersInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.customers", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("adminCustomersInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Customers.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("admin.customers", {});
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

Template.AdminCustomersInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminCustomersInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminCustomersInsertInsertFormErrorMessage");
	}
	
});
