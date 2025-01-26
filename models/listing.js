const mongoose=require('mongoose');
const { Schema } = mongoose;
const Review=require('./review');
const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        filename: {
            type: String,
            default: "listingimage", // Default value or you can leave it as required depending on your needs
        },
        url: {
            type: String,
            required: true,
            set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2V8ZW58MHx8MHx8fDA%3D" : v,
        },
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner:[
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    category:{
        type:String,
        enum:['mountains','beach','topofworld']
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
}
});

const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;