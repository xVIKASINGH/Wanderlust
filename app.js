require('dotenv').config()
const express=require("express");
const app=express();
const port=4000;
const mongoose =require("mongoose");
const path=require("path");
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
const ejsMate=require('ejs-mate');
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));
const listingsroute=require("./routes/listing.js")
const reviewRoute=require("./routes/reviewRoute.js")
const userroute=require("./routes/user.js")
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session")
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport");
const localstrategy=require("passport-local")
const User=require("./models/user.js");
const { savedUrl } = require("./utils/savedurl.js");
const usercontroller=require("./controllers/user.js")
const db_url=process.env.ATLAS_URL;

const store=MongoStore.create({
  mongoUrl:db_url,
  crypto:{
    secret:process.env.SESSION_SECRET
  },
  touchAfter:24*3600,

})
store.on("error",()=>{
  console.error("MongoDB connection error. Please make sure MongoDB is running.")
})

const sessionoption={
  store,
  secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
      expires:Date.now()+ 7*24*60*60*1000,
      maxAge:Date.now()+ 7*24*60*60*1000,
      httpOnly:true,
    }
}

app.use(session(sessionoption));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



async function connectdb() {
    try {
      console.log("Attempting to connect to the database...");
      await mongoose.connect(db_url), 
      console.log("Connection established");
    } catch (err) {
      console.error("Connection error:", err);
    }
  }

  connectdb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start the server:", err);
  });


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  next();
})

app.post("/search/:category", listingsroute);


  app.use("/list/:id/review",reviewRoute)
app.use("/list",listingsroute)
app.use("/signup", userroute)
app.get("/login",usercontroller.getlogin);

app.post("/login",savedUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(usercontroller.login))

app.get("/logout",(usercontroller.logout))


app.all("*",(req,res,next)=>{
 return next(new ExpressError(400,"page not found"));
})


app.use((err,req,res,next)=>{

  let {status=400,message="something is happend w8"}=err;
  res.render("error.ejs",{err})
})