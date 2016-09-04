// Questionnaire
Questionnaire.join(Customers, "customerId", "customer", ["name"]);

// Invoices
Invoices.join(Customers, "customerId", "customer", ["name"]);

