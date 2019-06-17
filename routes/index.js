var express = require("express");
var router = express.Router();
var passport = require("passport");
var Recipe = require("../models/recipe");
var User = require("../models/user");
var request = require('request');

router.get("/", function (req, res) {
    let noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Recipe.find({name: regex}, function (err, allRecipes) {
            if (err) {
                console.log(err);
            } else {
                if (allRecipes.length < 1) {
                    noMatch = "No campgrounds found, please try again.";
                }
                res.render("recipes/index", {recipes: allRecipes, page: "recipes", noMatch: noMatch});
            }
        });
    } else {
        Recipe.find({}, function (err, allRecipes) {
            if (err) {
                console.log(err);
            } else {
                res.render("recipes/index", {recipes: allRecipes, page: "recipes", noMatch: noMatch});
            }
        });
    }
});

router.post("/api/search", function (req, res) {
    console.log("hmmm");
    url = "https://www.food2fork.com/api/search?key=082c86103b169fdd1178506d4705b78e&q=" + req.body.search;
    console.log(url);
    request({url, json: true}, function (err, reso, json) {
        if (err) {
            throw err;
        }
        noMatch = json['recipes'];
        console.log(noMatch);
        res.render("apisearch", {noMatch: noMatch})
    });
});

// Login, GET & POST
router.get("/login", function (req, res) {
    res.render("login");
});

// Login, GET & POST
router.get("/api", function (req, res) {
    res.render("api")
});


router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/recipes';
            delete req.session.redirectTo;
            req.flash("success", "Good to see you again, " + user.firstName);
            res.redirect(redirectTo);
        });
    })(req, res, next);
});


//Register
router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {
    var firstname = req.body.firstName;
    var lastname = req.body.lastName;
    var email = req.body.email;
    var newUser = new User({firstName: firstname, lastName: lastname, email: email, username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to Recipe Center " + user.username);
            res.redirect("/recipes");
        });
    });
});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/recipes");
});

module.exports = router;