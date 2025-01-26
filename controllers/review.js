const Review=require("../models/review.js");
const Listing=require("../models/listing.js")


module.exports.createreview=(async(req,res)=>{
    let listid=req.params.id;
    let list=await Listing.findById(req.params.id);
  
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    list.reviews.push(newreview);
   
    await list.save();
    await newreview.save();
    req.flash("success","Review Added SucessFully")
    res.redirect(`/list/view/${listid}`);
  
  
  
  })


module.exports.deletereview=(async(req,res)=>{
  
  let {id,reviewid}=req.params;
   
    let list=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
    await Review.findByIdAndDelete(reviewid);
  req.flash("success","Review Deleted ")

    res.redirect(`/list/view/${id}`)
  })