var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    moment = require("moment"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Recipe = require("./models/recipe"),
    Comment = require("./models/comment"),
    User = require("./models/user");


app.locals.moment = moment;

var commentRoutes = require("./routes/comments"),
    recipeRoutes = require("./routes/recipe"),
    indexRoutes = require("./routes/index"),
    userProfileRoute = require("./routes/user");


app.use(flash());
//Passport Config
app.use(require("express-session")({
    secret: "Recipe Center rock!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


mongoose.connect("mongodb://heroku_75p99lp5:ujore4589fqioc2oor7nnbgv84@ds339177.mlab.com:39177/heroku_75p99lp5");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);
app.use("/user/", userProfileRoute);

app.listen(3000, function () {
    console.log("Server started!");
});