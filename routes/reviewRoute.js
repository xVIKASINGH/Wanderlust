
const router = require("express").Router({ mergeParams: true }); // Merge params from parent route
const asyncwrap=require("../utils/asyncwrap.js")
const {isloggedIn,  isReviewauthor}=require("../utils/Loggedin.js")
const Reviewcontroller=require("../controllers/review.js");



// adding new Review route 
router.post("/",
  isloggedIn,
  asyncwrap(Reviewcontroller.createreview))


// deleting reviews 
router.delete("/:reviewid",
  isloggedIn,
  isReviewauthor,
  asyncwrap(Reviewcontroller.deletereview));
  


module.exports=router;