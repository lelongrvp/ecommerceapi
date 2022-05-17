const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token
    if(authHeader){
        //split the header
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
            //check if the token is match with user's token in database
            if(err) res.status(403).json("Token is not valid");
            req.user = user;
            next();
        })
    } else{
        //if user doesn't have the token, return error message
        return res.status(401).json("You are not authenticated!")
    }
};

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        //Check the admin status
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that!")
        }
    });
};

const verifyTokenAndAdmin = (req, res, next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        } else{
            res.status(403).json("You are not allowed to do that!");
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};