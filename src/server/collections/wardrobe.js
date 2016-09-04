Wardrobe.allow({
    insert: function (userId, doc) {
        return Wardrobe.userCanInsert(userId, doc);
    },

    update: function (userId, doc, fields, modifier) {
        return Wardrobe.userCanUpdate(userId, doc);
    },

    remove: function (userId, doc) {
        return Wardrobe.userCanRemove(userId, doc);
    }
});

Wardrobe.before.insert(function (userId, doc) {
    doc.createdAt = new Date();
    doc.createdBy = userId;
    doc.modifiedAt = doc.createdAt;
    doc.modifiedBy = doc.createdBy;


    if (!doc.createdBy) doc.createdBy = userId;
});

Wardrobe.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modifiedAt = new Date();
    modifier.$set.modifiedBy = userId;


});

Wardrobe.before.upsert(function (userId, selector, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modifiedAt = new Date();
    modifier.$set.modifiedBy = userId;

    /*BEFORE_UPSERT_CODE*/
});

Wardrobe.before.remove(function (userId, doc) {

});

Wardrobe.after.insert(function (userId, doc) {

});

Wardrobe.after.update(function (userId, doc, fieldNames, modifier, options) {

});

Wardrobe.after.remove(function (userId, doc) {

});
