this.InvoiceItems = new Mongo.Collection("invoice_items");

this.InvoiceItems.userCanInsert = function(userId, doc) {
	return true;
};

this.InvoiceItems.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.InvoiceItems.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
