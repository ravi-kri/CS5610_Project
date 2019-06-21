var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");

var multer = require('multer');
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dg8vtt8rh',
    api_key: 718559968163166,
    api_secret: "jzTooVTIJEcd4okLTYj4U-PuA84"
});

router.get("/", function (req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Recipe.find({name: regex}, function (err, allRecipes) {
            if (err) {
                console.log(err);
            } else
                res.render("recipes/index", {recipes: allRecipes, currentUser: req.user});
        });
    } else {

        Recipe.find({}, function (err, allRecipes) {
            if (err) {
                console.log(err);
            } else
                res.render("recipes/index", {recipes: allRecipes, currentUser: req.user});
        });
    }
});


router.get("/add", isLoggedIn, function (req, res) {
    res.render("recipes/new");
});

router.post("/", isLoggedIn, upload.single('image'), function (req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        req.body.recipe.image = result.secure_url;
        req.body.recipe.imageId = result.public_id;
        req.body.recipe.author = {
            id: req.user._id,
            username: req.user.username
        };
        Recipe.create(req.body.recipe, function (err, recipe) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            res.redirect('/recipes/' + recipe.id);
        });
    });
});

router.get("/:id", function (req, res) {
    Recipe.findById(req.params.id).exec(function (err, foundRecipe) {
        if (err) {
            console.log(err);
        } else {
            if (req.user) {
                if (req.user.recipesBookmarked.includes(req.params.id)) {
                    res.render("recipes/show", {recipe: foundRecipe, alreadyBookmarked: true});
                } else {
                    res.render("recipes/show", {recipe: foundRecipe, alreadyBookmarked: false});
                }
            } else {
                res.render("recipes/show", {recipe: foundRecipe, alreadyBookmarked: false});
            }
        }
    })
});


router.get("/:id/edit", recipeOwnershipAuthentication, function (req, res) {
    Recipe.findById(req.params.id, function (err, foundRecipe) {
        res.render("recipes/edit", {recipe: foundRecipe});
    });
});

router.put("/:id", upload.single('image'), function (req, res) {
    Recipe.findById(req.params.id, async function (err, recipe) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(recipe.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    recipe.imageId = result.public_id;
                    recipe.image = result.secure_url;
                } catch (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            recipe.name = req.body.recipe.name;
            recipe.description = req.body.recipe.description;
            recipe.ingredients = req.body.recipe.ingredients;
            recipe.save();
            req.flash("success", "Successfully Updated!");
            res.redirect("/recipes/" + recipe._id);
        }
    });
});


router.delete('/:id', function (req, res) {
    Recipe.findById(req.params.id, async function (err, recipe) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(recipe.imageId);
            recipe.remove();
            req.flash('success', 'Recipe deleted successfully!');
            res.redirect('/recipes');
        } catch (err) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
        }
    });
});


function recipeOwnershipAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        Recipe.findById(req.params.id, function (err, foundRecipe) {
            if (err) {
                req.flash("error", "Recipe not found!");
                res.redirect("back");
            } else {
                if (foundRecipe.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;