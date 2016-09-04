Questionnaire.allow({
    insert: function (userId, doc) {
        return Questionnaire.userCanInsert(userId, doc);
    },

    update: function (userId, doc, fields, modifier) {
        return Questionnaire.userCanUpdate(userId, doc);
    },

    remove: function (userId, doc) {
        return Questionnaire.userCanRemove(userId, doc);
    }
});

Questionnaire.before.insert(function (userId, doc) {
    doc.createdAt = new Date();
    doc.createdBy = userId;
    doc.modifiedAt = doc.createdAt;
    doc.modifiedBy = doc.createdBy;


    if (!doc.ownerId) doc.ownerId = userId;
});

Questionnaire.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modifiedAt = new Date();
    modifier.$set.modifiedBy = userId;


});

Questionnaire.before.upsert(function (userId, selector, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modifiedAt = new Date();
    modifier.$set.modifiedBy = userId;

    /*BEFORE_UPSERT_CODE*/
});

Questionnaire.before.remove(function (userId, doc) {

});

Questionnaire.after.insert(function (userId, doc) {

});

Questionnaire.after.update(function (userId, doc, fieldNames, modifier, options) {

});

Questionnaire.after.remove(function (userId, doc) {

});
