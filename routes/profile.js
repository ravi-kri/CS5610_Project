var express = require("express");
var router = express.Router({mergeParams: true});
var Recipe = require("../models/recipe");
var Profile = require("../models/user");

router.get("/:id/edit", isLoggedIn, function (req, res) {
    Profile.findById(req.params.id).exec(function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            res.render("users/edit", {user: foundUser});
        }
    });
});


router.get("/:id", isLoggedIn, function (req, res) {
    Profile.findById(req.params.id).exec(function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            Recipe.find({}, function (err, everyRecipe) {
                if (err) {
                    console.log(err);
                } else {
					// allRecipe = everyRecipe
					Recipe.find().where("author.id").equals(foundUser._id).exec((err, userRecipes) => {
						if (err) {
							console.log(err);
						} else {
						Recipe.find({ "_id": { "$in": foundUser.recipesBookmarked } })
    					.exec(function (err, bookmarkedRecipesforSending){
							if(err){
								return console.log(err);
							} else {
						res.render("userProfile", {recipes: userRecipes, user: foundUser, 
							bookmarkedRecipesapiarray : foundUser.recipesBookmarkedapi,
							bookmarkedRecipesforSending : bookmarkedRecipesforSending,
							allRecipe: everyRecipe});
						}
					});
                }

			});
        }
    });
		}})});

//Updating a Comment
router.put("/:id", isLoggedIn, function (req, res) {
    Profile.findByIdAndUpdate(req.params.id, req.body.user, function (err, updatedUser) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated Profile!");
            res.redirect("/profile/" + req.params.id);
        }
    });
});

//Authentication to verify if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = router;