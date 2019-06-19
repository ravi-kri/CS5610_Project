var mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageId: String,
    description: String,
    author:
        {
            id:
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
            username: String
        },
    bookmarkedBy:[{
        id:
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
            username: String
    }]
});

module.exports = mongoose.model("Recipe", recipeSchema);