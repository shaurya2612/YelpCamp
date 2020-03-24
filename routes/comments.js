var express=require("express");
var router=express.Router({mergeParams: true});
var Campground=require("../models/campground");
var Comment=require("../models/comment")
var middleware=require("../middleware");

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res)
{
   Campground.findById(req.params.id,function(err,campground)
   {
       if(err)
       {   
           console.log(err)
       }
       else
       {
           res.render("comments/new",{campground:campground});
       }
   })
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res)
{
    Campground.findById(req.params.id,function(err, campground) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            Comment.create(req.body.comment,function(err,comment){
                    if(err){
                        console.log(err);
                    }
                    else{
                    comment.author.id=req.user.id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(/campgrounds/+req.params.id)
                    }
               })
        }
    })
})

router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
   Comment.findById(req.params.comment_id,function(err,comment){
       if(err){
           console.log(err);
           res.redirect("back");
       }
       else{
           res.render("comments/edit",{comment:comment,campground_id:req.params.id})
       }
   })
});

router.post("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success","updated comment")
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

router.post("/campgrounds/:id/comments/:comment_id/delete",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success","deleted comment successfully")
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
})

module.exports=router;