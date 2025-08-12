const adminAuth = (req, res ,next)=>{

    try{
        console.log("admin auth is getting checked..")
        const token = "admin"
        const isAuthorised = token == 'admin';
        if(!isAuthorised){
            res.status(403).send("unauthorized request")
        }else{
            next();
        }
        
        
    }catch(err){
        res.status(401).send(err.message ? err.message : "something went wrong in use ")

    }
 
}


const userAuth = (req, res ,next)=>{
  console.log("user is authenticated")
  next();
}
  

module.exports = {adminAuth , userAuth}