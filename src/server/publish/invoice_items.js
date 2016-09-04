Meteor.publish("invoice_items", function (invoiceId) {
    return InvoiceItems.find({invoiceId: invoiceId, ownerId: this.userId}, {});
});

Meteor.publish("invoice_items_empty", function () {
    return InvoiceItems.find({_id: null, ownerId: this.userId}, {});
});

Meteor.publish("invoice_item", function (itemId) {
    return InvoiceItems.find({_id: itemId, ownerId: this.userId}, {});
});

