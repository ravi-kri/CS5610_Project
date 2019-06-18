var express = require("express");
var router = express.Router({mergeParams: true});
var Recipe = require("../models/recipe");
var User = require("../models/user");

router.get("/:id/edit", isLoggedIn, function (req, res) {
    User.findById(req.params.id).exec(function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            res.render("users/edit", {user: foundUser});
        }
    });
});

router.get("/:id", isLoggedIn, function (req, res) {
    User.findById(req.params.id).exec(function (err, foundUser) {
        let allRecipe;
        if (err) {
            console.log(err);
        } else {
            console.log(User.find({}));
            Recipe.find({}, function (err, everyRecipe) {
                if (err) {
                    console.log(err);
                } else {
                    allRecipe = everyRecipe
                }

            });
            Recipe.find().where("author.id").equals(foundUser._id).exec((err, userRecipes) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render("userProfile", {recipes: userRecipes, user: foundUser, allRecipe: allRecipe});

                }
            });
        }
    });
});

//Updating a Comment
router.put("/:id", isLoggedIn, function (req, res) {
    console.log(req);
    User.findByIdAndUpdate(req.params.id, req.body.user, function (err, updatedUser) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated Profile!");
            res.redirect("/user/" + req.params.id);
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