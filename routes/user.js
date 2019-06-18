var express = require("express");
var router = express.Router({mergeParams: true});
var Recipe = require("../models/recipe");
var User = require("../models/user");

router.get("/:id/edit", function (req, res) {
    User.findById(req.params.id).exec(function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            res.render("users/edit", {user: foundUser});
        }
    });
});

router.post("/:id", function (req, res) {
    console.log(req);
    User.findByIdAndUpdate(req.params.id,
        req.user,
        {new: true},
        function (err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            console.log("Got ");
            console.log(user);
            // user.firstName = req.user.firstName;
            // user.lastName = req.user.lastName;
            // user.email = req.user.email;
            // user.save();
            req.flash("success", "Profile Successfully Updated!");
            res.redirect("/user/" + user._id);
        }
    });
});

router.get("/:id", function (req, res) {
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


module.exports = router;