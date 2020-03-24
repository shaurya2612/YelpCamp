var express= require("express");
var app= express();
var bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
var mongoose= require("mongoose");
var Campground=require("./models/campground");
var seedDB=require("./seeds")
var Comment=require("./models/comment");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var methodOverride=require("method-override")
var flash=require("connect-flash");

var commentRoutes= require("./routes/comments");
var indexRoutes= require("./routes/index");
var campgroundRoutes=require("./routes/campgrounds");

//seedDB();

mongoose.connect( process.env.MONGODB_URI,{
    useUnifiedTopology: true,
    useNewUrlParser: true
});
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(require("express-session")({
    secret:"Blues are a part of life",
    resave:false,
    saveUninitialized:false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})

app.use(commentRoutes);
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(methodOverride("_method"));


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server Started");
});