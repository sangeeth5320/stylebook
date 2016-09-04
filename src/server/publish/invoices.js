Meteor.publish("invoice_list", function () {
    return Invoices.publishJoinedCursors(Invoices.find({ownerId: this.userId}, {sort: [["invoiceNumber", "desc"]]}));
});

Meteor.publish("invoices_empty", function () {
    return Invoices.publishJoinedCursors(Invoices.find({_id: null, ownerId: this.userId}, {}));
});

Meteor.publish("invoice_details", function (invoiceId) {
    return Invoices.publishJoinedCursors(Invoices.find({_id: invoiceId, ownerId: this.userId}, {}));
});

