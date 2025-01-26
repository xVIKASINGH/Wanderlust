const express = require("express");
const router = express.Router();
const asyncwrap=require("../utils/asyncwrap");
const usercontroller=require("../controllers/user")
// signup get page
router.get("/",(usercontroller.getsignup));

// signup process
router.post("/",asyncwrap(usercontroller.signup));




module.exports = router;
