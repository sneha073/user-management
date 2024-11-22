const isLogin = async(req,res,next)=>{
    try{
        if(req.session.user_id){
            res.setHeader("Cache-Control","no-store")
            return next();
        }else{
            res.redirect('/')
        }

    }catch(error){
        console.log(error.message);
    }
}

const isLogout = async(req,res,next)=>{
    try{

        if(req.session.user_id){
            res.setHeader("Cache-Control","no-store")
           return res.redirect('/home')
        }
        next()

    }catch(error){
        console.log(error.message);
    }
}
module.exports = {
    isLogin,
    isLogout
}