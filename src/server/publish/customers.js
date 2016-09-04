Meteor.publish("customer_list", function () {
    return Customers.find({}, {
        transform: function (doc) {
            var sum = 0;
            Invoices.find({customerId: doc._id}).map(function (item) {
                if (item.totalAmount) sum += item.totalAmount;
            });
            doc.totalAmount = sum;
            return doc;
        }, sort: ["name"]
    });
});

Meteor.publish("customers_empty", function () {
    return Customers.find({_id: null}, {});
});

Meteor.publish("customer_details", function (customerId) {
    return Customers.find({_id: customerId}, {
        transform: function (doc) {
            var sum = 0;
            Invoices.find({customerId: doc._id}).map(function (item) {
                sum += item.totalAmount;
            });
            doc.totalAmount = sum;
            return doc;
        }
    });
});

