const isLogin = async(req,res,next)=>{
    try{
        if(req.session.admin_id){
            console.log(req.session,'session')
            res.setHeader("Cache-Control","no-store")
            return next();
        }else{
            res.redirect('/admin')
        }
    }catch(error){
        console.log(error.message);
    }
}
const isLogout = async(req,res,next)=>{
    try {
        if(req.session.admin_id){
            console.log(req.session,'session')
            res.setHeader("Cache-Control","no-store")
            return res.redirect('/admin/home')
        }
        next();
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    isLogin,
    isLogout
}