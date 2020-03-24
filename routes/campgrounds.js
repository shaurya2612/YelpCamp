var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");

router.get("/campgrounds",function(req,res){
        Campground.find({},function(err,allCampgrounds){
            if(err){
                console.log("ERROR at getting campgrounds")
                console.log(err);
            }
            else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
            }
            });
});

router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
   var name=req.body.name;
   var image=req.body.image;
   var description=req.body.description;
//   campgrounds.push({name:name,image:image});
   var newCampground={name:name,image:image,description:description,author:{id:req.user.id,username:req.user.username}};
   Campground.create(newCampground,function(err,campground){
          if(err){
              console.log("ERROR");
              console.log(err);
          }
          else{
              console.log("ADDED NEW CAMPGROUND")
              console.log(campground);
              res.redirect("/campgrounds");
          }
          });
});

router.get("/campgrounds/new",middleware.isLoggedIn, function(req,res){
   res.render("campgrounds/new");
});

router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log("error in getting show page");
        }
        else{
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});

router.post("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,editedCampground){
        if(err){
            res.redirect("/campgrounds")
        }
        else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    });
});

router.post("/campgrounds/:id/delete",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err,removedCampground){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds")
        }
    })
})

module.exports=router;
