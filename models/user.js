var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    type: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    username: String,
    password: String,
    recipesBookmarked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "recipe"
        }
    ],
    recipesBookmarkedapi: [ {
        type: String
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);