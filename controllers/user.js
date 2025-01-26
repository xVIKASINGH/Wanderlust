const User=require("../models/user")



module.exports.getsignup= (req, res) => {
    res.render("signup");
  }

module.exports.signup=(async(req,res)=>{
    try {
     let {email,username,password}=req.body;
     let newuser= await new User({email,username});
 
   const registereduser=    await User.register(newuser,password);
   req.login(registereduser,(err=>{
    if(err)return next(err);
    req.flash("success","Successfully registered")
    res.redirect("/list");
   }))
    
 
    } catch (error) {
       req.flash("error","user is already registered");
       res.redirect("/signup");
    }
 
 
  
 })

module.exports.getlogin= (req, res) => {
 
    res.render("login.ejs");
  }
module.exports.login=async(req,res)=>{
  req.flash("success","Welcome to Wanderlust");
  let redirect =res.locals.redirectUrl || "/list";
  res.redirect(redirect);

}

module.exports.logout=(req,res,err)=>{
  
    req.logOut(err=>{
       if(err){
          return next(err)
       }
       req.flash("success","logged out");
       res.redirect("/list");
    })
  }