const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const loadLogin = async(req,res)=>{
    try{
        res.render('login');
    } catch(error){
        console.log(error.message);
    }
}
const verifyLogin = async(req,res)=>{
    try{
       
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email});
        if(userData){

           const passwordMatch = await bcrypt.compare(password,userData.password)

           if(passwordMatch){

            if(userData.is_admin ===0){
                res.render('login',{message:"Email and password is incorrect"})
            }else{
                req.session.user_id = userData._id;
                res.redirect("/admin/home")
            }

           }else{
                res.render('login',{message:"Email and Password is incorrect"});
           }

        }else{
            res.render('login',{message:"Email and Password is incorrect"});
        }

    }catch(error){
        console.log(error.message);
    }
}
const loadDashboard = async(req,res)=>{
    try{
        const userData = await User.findById({_id:req.session.user_id})
        res.render('home',{admin:userData});
    }catch(error){
        console.log(error.message);
    }
}
const logout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin')
    }catch(error){
        console.log(error.message)
    }
}
const adminDashboard = async(req,res)=>{
    try {
        const userData = await User.find({is_admin:0});
        res.render('dashboard',{users:userData})
    } catch (error) {
        console.log(error.message);
    }
}
// Add New User
const newUserLoad = async(req,res)=>{
    try{
        res.render('new-user')
    }catch(error){
        console.log(error.message);
    }
}
const addUser = async(req,res)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const isUserExist = await User.findOne({email:email})
        if(isUserExist){
            res.render('new-user',{message:'User already exist'});
        }
        const mno = req.body.mno;
        const password=req.body.password
        console.log(req.body)
        const hashedPassword = await bcrypt.hash(req.body.password,10) 

        const user = new User({
            name:name,
            email:email,
            mobile:mno,
            password:hashedPassword,
            is_admin:0
        });
        
        const userData = await user.save();
        
        if(userData){
            return res.redirect('/admin/dashboard')
        }else{
            res.render('new-user',{message:'Something went Wrong'});
        }
    }catch(error){
        console.log(error.message);
    }
}
// edit user

const editUserLoad = async(req,res)=>{
    try{
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        if(userData){
            res.render('edit-user',{user:userData});
        }else{
            res.redirect('/admin/dashboard');
        }
        
    }catch(error){
        console.log(error.message);
    }
}
const updateUsers = async(req,res)=>{
    try{
        const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{ name:req.body.name,email:req.body.email,mobile:req.body.mno }});

        res.redirect('/admin/dashboard')

    }catch(error){
        console.log(error.message)
    }
}
// delete users
const deleteUser = async(req,res)=>{
    try {
        const id = req.query.id;
        await User.deleteOne({_id:id });
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}