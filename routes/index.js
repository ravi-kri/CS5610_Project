var express = require("express");
var router = express.Router();
var passport = require("passport");
var Recipe = require("../models/recipe");
var User = require("../models/user");
var request = require('request');

router.get("/", function (req, res) {
    let noMatch = null;
    if (!req.user) {
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Recipe.find({ name: regex }, function (err, allRecipes) {
                if (err) {
                    console.log(err);
                } else {
                    if (allRecipes.length < 1) {
                        noMatch = "No recipes found, please try again.";
                    }
                    res.render("recipes/index", { recipes: allRecipes, page: "recipes", noMatch: noMatch });
                }
            });
        } else {
            Recipe.find({}, function (err, allRecipes) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("recipes/index", { recipes: allRecipes, page: "recipes", noMatch: noMatch });
                }
            });
        }
    } else {
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Recipe.find({ name: regex }, function (err, allRecipes) {
                if (err) {
                    console.log(err);
                } else {
                    if (allRecipes.length < 1) {
                        noMatch = "No recipes found, please try again.";
                    }
                    res.render("recipes/index", { recipes: allRecipes, page: "recipes", noMatch: noMatch });
                }
            });
        } else {
            Recipe.find({}, function (err, allRecipes) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("recipes/index", { recipes: allRecipes, page: "recipes", noMatch: noMatch });
                }
            });
        }
    }
});

router.get("/search", function (req, res) {
    url = "https://www.food2fork.com/api/search?key=d088c14b6ef55995aebe59e55e37e5cf&q=" + req.query.recipe;
    request({ url, json: true }, function (err, reso, json) {
        if (err) {
            throw err;
        } else { }
        noMatch = json['recipes'];
        res.render("search", { noMatch: noMatch })
    });
});

router.get("/details", function (req, res) {
    url = "https://www.food2fork.com/api/get?key=d088c14b6ef55995aebe59e55e37e5cf&rId=" + req.query.recipe_id;
    request({ url, json: true }, function (err, reso, json) {
        if (err) {
            throw err;
        } else {
            let alreadyBookmarked = false
            noMatch = json['recipe'];
            User.find({ recipesBookmarkedapi: { $elemMatch: { recipe_id: req.query.recipe_id } } }, function (err, users) {
                if(req.user){
                users.forEach(function(user){ 
                    if(user.username == req.user.username){
                        alreadyBookmarked = true
                    }
                })}
                res.render("details", { noMatch: noMatch, users: users, alreadyBookmarked: alreadyBookmarked })
            })

        }


    });
});

// Login, GET & POST
router.get("/login", function (req, res) {
    res.render("login");
});

// Login, GET & POST
router.get("/search", function (req, res) {
    res.render("search")
});


router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
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
            req.flash("success", "Welcome " + user.firstName);
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
    var type = req.body.type;
    var newUser = new User({
        firstName: firstname,
        lastName: lastname,
        email: email,
        type: type,
        username: req.body.username
    });
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
    res.redirect("/");
});


//New bookmark, POST
router.post("/bookmarked", isLoggedIn, function (req, res) {
    Recipe.findById(req.body.idofrecipe, function (err, recipe) {
        if (err) {
            console.log(err);
            res.redirect("/recipes");
        } else {
            User.find(req.user._id, function (err, user) {
                var newuser = user[0];
                newuser.recipesBookmarked.push(recipe);
                newuser.save();
                recipe.bookmarkedBy.push(newuser)
                recipe.save();
                req.flash("success", "Successfully added bookmark!");
                res.redirect("/recipes/" + recipe._id);

            });
        }

    });
});

// Remove bookmark internal
router.post("/removebookmarked", isLoggedIn, function (req, res) {
    Recipe.findById(req.body.idofrecipe, function (err, recipe) {
        if (err) {
            console.log(err);
            res.redirect("/recipes");
        } else {
            User.find(req.user._id, function (err, user) {
                var newuser = user[0];
                newuser.recipesBookmarked.remove(recipe);
                newuser.save();
                recipe.bookmarkedBy.remove(newuser)
                recipe.save();
                req.flash("success", "Successfully removed bookmark!");
                res.redirect("/recipes/" + recipe._id);

            });
        }

    });
});

//New bookmark, POST
router.post("/bookmarkedapi", isLoggedIn, function (req, res) {
    User.find(req.user._id, function (err, user) {
        var newuser = user[0];
        newuser.recipesBookmarkedapi.push(req.body);
        newuser.save();
        req.flash("success", "Successfully added bookmark!");
        res.redirect("/recipes");
    });
});


//remove bookmark from api recipes
router.post("/removebookmarkedapi", isLoggedIn, function (req, res) {
    User.update({_id : req.user._id},{$pull : {recipesBookmarkedapi: {recipe_id: req.body.recipe_id}}},function(){
        req.flash("success", "Successfully removed bookmark!");
        res.redirect("/recipes");  
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = router;