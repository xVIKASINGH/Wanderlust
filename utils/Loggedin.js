const Listing = require("../models/listing");
const Review=require("../models/review");
module.exports.isloggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","error, you must be logged in!");
      return   res.redirect("/login");
      }
      next();
}


module.exports.isowner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  const currentUser = res.locals.currentUser;
  if (!currentUser || !currentUser._id.equals(listing.owner.toString())) {
    req.flash("error", "Only the owner can edit this listing.");
    return res.redirect(`/list/view/${id}`);
  }
  
  next();
}

module.exports.isReviewauthor=async(req,res,next)=>{
  let {id,reviewid}=req.params;
  
  let review=await Review.findById(reviewid);
 
if (!review) {
  req.flash("error", "Review not found.");
  return res.redirect(`/list/view/${id}`);
}
  const currentUser=res.locals.currentUser;
  if(!currentUser || !currentUser._id.equals(review.author)){
    req.flash("error","Only the  author can delete this review.");
    return res.redirect(`/list/view/${id}`);
  }
  next();
}
