const Listing=require("../models/listing")
const ExpressError=require("../utils/ExpressError")

module.exports.index=(async(req,res)=>{
    const listings=await Listing.find({})
    res.render("show.ejs",{listings});
})

module.exports.show=(async(req,res)=>{
    const userid=req.params.id;
    const listing=await Listing.findById(userid).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error","list does not exist");
      res.redirect("/list");
    }
    res.render("view.ejs",{listing});
  })


module.exports.newpage=async(req,res)=>{
    res.render("create.ejs");
  }

module.exports.create=(async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting=req.body;
    if (!newlisting) {
      return next(new ExpressError(400,"Please Fill neccessary details"));
    }
    const listing=new Listing(req.body);
  
    listing.image={filename,url};
 
    listing.owner=req.user._id;

    await listing.save();
    req.flash("success","Place Registered successfully");
    res.redirect("/list");

  
  })
module.exports.search=(async (req, res) => {
  try {
    const category = req.body.destination.toLowerCase();
    const validateCategory = ["mountains", "beach", "topofworld"];

    if (!validateCategory.includes(category)) {
      req.flash("error", "Invalid category");
      return res.redirect("/list");
    }

    const searchedCategory = await Listing.find({ category: category });
    
    if (!searchedCategory) {
      req.flash("error", "Category not found");
      return res.redirect("/list");
    }

    res.render("filterlist.ejs",{searchedCategory})
  } catch (error) {
    req.flash("error", "An error occurred");
    res.redirect("/list");
  }
})


module.exports.editpage=(async(req,res)=>{
    const userid=req.params.id;
   const listing=await Listing.findById(userid);
   if(!listing){
    req.flash("error","list does not exist");
    res.redirect("/list");
  }
  let orginalimageurl=listing.image.url;
  orginalimageurl=orginalimageurl.replace("/upload","/upload/w_250");
   res.render("update.ejs",{listing,orginalimageurl})
})

module.exports.edit=(async (req, res) => {

const userid = req.params.id;


let updatedListing = await Listing.findById(userid);
if (!updatedListing) {
    console.error("Listing not found");
    req.flash("error", "Listing not found");
    return res.status(404).redirect("/list");
}

const { title, description, price, location, country } = req.body;
updatedListing.title = title;
updatedListing.description = description;
updatedListing.price = price;
updatedListing.location = location;
updatedListing.country = country;


if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { filename, url };
}

// Save the updated listing
await updatedListing.save();

req.flash("success", "Listing updated successfully");
res.redirect(`/list/view/${userid}`);
  })

module.exports.delete=(async(req,res)=>{
    let placeid=req.params.id;

  await  Listing.findByIdAndDelete(placeid);
  req.flash("success","List Deleted SucessFully")
   return  res.redirect("/list");

})