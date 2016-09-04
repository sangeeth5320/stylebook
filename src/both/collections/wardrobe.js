this.Wardrobe = new Mongo.Collection("wardrobe");

this.Wardrobe.userCanInsert = function(userId, doc) {
	return true;
};

this.Wardrobe.userCanUpdate = function(userId, doc) {
	return true;
};

this.Wardrobe.userCanRemove = function(userId, doc) {
	return true;
};
