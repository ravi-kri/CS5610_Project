var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    type: String,
    username: {type: String, unique: true, required: true},
    password: String,
    recipesBookmarked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "recipe"
        }
    ],
    recipesBookmarkedapi: [{
        title: String,
        source_url: String,
        publisher_url: String,
        recipe_id: String,
        image_url: String,
        publisher: String
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);