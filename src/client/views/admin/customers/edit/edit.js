var pageSession = new ReactiveDict();

Template.AdminCustomersEdit.rendered = function() {
	
};

Template.AdminCustomersEdit.events({
	
});

Template.AdminCustomersEdit.helpers({
	
});

Template.AdminCustomersEditEditForm.rendered = function() {
	

	pageSession.set("adminCustomersEditEditFormInfoMessage", "");
	pageSession.set("adminCustomersEditEditFormErrorMessage", "");

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

Template.AdminCustomersEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("adminCustomersEditEditFormInfoMessage", "");
		pageSession.set("adminCustomersEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var adminCustomersEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(adminCustomersEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("adminCustomersEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("admin.customers", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("adminCustomersEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Customers.update({ _id: t.data.customer_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.AdminCustomersEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("adminCustomersEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("adminCustomersEditEditFormErrorMessage");
	}
	
});
