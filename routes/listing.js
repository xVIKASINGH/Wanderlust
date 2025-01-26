const express=require("express");
const router=express.Router();
const asyncwrap=require("../utils/asyncwrap.js")

const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage })

const {isloggedIn,isowner}=require("../utils/Loggedin.js")

const lisitingcontroller=require("../controllers/listing.js");
const { listIndexes } = require("../models/review.js");










// index route
router.get("/", asyncwrap(lisitingcontroller.index))
//show route
router.get("/view/:id", asyncwrap(lisitingcontroller.show))
// create route
router.get("/create",isloggedIn,(lisitingcontroller.newpage))
router.post("/", upload.single("imageUrl"),asyncwrap(lisitingcontroller.create));
  
// edit your list route
  router.get("/edit/:id",isloggedIn,isowner, asyncwrap(lisitingcontroller.editpage))

// search route
router.post("/search/:category",asyncwrap(lisitingcontroller.search));


router.put("/update/:id",upload.single("imageUrl"), asyncwrap(lisitingcontroller.edit));


  router.delete("/delete/:id",isloggedIn, asyncwrap(lisitingcontroller.delete))

module.exports = router;
