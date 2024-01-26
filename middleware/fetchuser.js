const jwt = require('jsonwebtoken');
const JWT_SECRET = "NoteBookAuthoriedByDishuMavi9625626405";

// Middleware: fetchuser
const fetchuser = (req,res,next)=>{//next will take next function to be called this will be async(req,res)={} in auth.js

    // Get the user from jwtToken and add it to req object.
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error:"Invalid Authentication Token"});
    }
    
    // Authentication Invalid Case Handled using try-catch block
    try{
        const string = jwt.verify(token,JWT_SECRET);//authentication token is made up of JWT_SECRET and data(Which is user's id) so verify fucntion after taking authentication token and JWT_SECRET, it will return user id so that we can fetch user.

        // Manipulating request:
        req.user = string.user;
        next()
    }catch(errors){
        console.error(errors.message);
        res.status(401).send("Invalid authentication token.");
    }
}
module.exports = fetchuser;