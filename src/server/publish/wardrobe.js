Meteor.publish("wardrobe", function () {
    return Wardrobe.publishJoinedCursors(Wardrobe.find({}, {}));
});

Meteor.publish("wardrobe_empty", function () {
    return Wardrobe.publishJoinedCursors(Wardrobe.find({_id: null}, {}));
});

