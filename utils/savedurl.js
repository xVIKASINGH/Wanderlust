module.exports.savedUrl=(req,res,next)=>{
    console.log(req.session.redirectUrl);
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
}

