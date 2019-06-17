var express = require("express");
var router = express.Router({mergeParams : true});
var Recipe = require ("../models/recipe");
var User = require("../models/user");


router.get("/:id", function(req,res){
	User.findById(req.params.id).exec(function(err, foundUser){
		let allRecipe;
		if (err){
			console.log(err);
		}
		else{	
				console.log(User.find({}))
				Recipe.find({}, function(err, everyRecipe){
					if (err){
						console.log(err);
					}
					else{
						allRecipe = everyRecipe
					}
						
				});
				Recipe.find().where("author.id").equals(foundUser._id).exec((err, userRecipes) => {
					if (err)
					{
						console.log(err);
					}
					else
					{	
						res.render("userProfile", {recipes : userRecipes, user : foundUser, allRecipe : allRecipe});

					}
				});
			}
		});
});



module.exports = router;