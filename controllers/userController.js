const User = require('../models/userModel');

const bcrypt = require('bcrypt');

const securePassword = async(password)=>{

    try{

       const passwordHash = await bcrypt.hash(password,10);
       return passwordHash;


    }catch(error){
        console.log(error.message);
    }
}

const loadRegister = async(req,res)=>{
    try{
        console.log('reigstration')
        res.render('registration');

    }catch (error){
        console.log(error.message);
    }
}
const insertUser = async(req,res)=>{
    try {
        const {name,email,mno,password} = req.body;
        const spassword = await securePassword(password);
        const isUserExist = await User.findOne({email:email})
        if(isUserExist){
            res.render('registration',{message:'User already exist'});
        }
        const user = new User({
            name:name,
            email:email,
            mobile:mno,
            password:spassword,
            is_admin:0,
        });
        
        const userData = await user.save();

        if(userData){
            res.redirect('/login');
        }else{
            res.render('registration',{message:"Your registration has been failed."});
        }
    } catch (error) {
        console.log(error.message);
    }
}

//login user methods

const loginLoad = async(req,res)=>{
    try{

        res.render("login");

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

            const passwordMatch = await bcrypt.compare(password,userData.password); 

            if(passwordMatch){
                    req.session.user_id = userData._id;
                    res.redirect('/home');
            }else{
                res.render('login',{message:"Email and password is incorrect"})
            }

        }
        else{
            res.render('login',{message:"Email and password is incorrect"})
        }

    }catch(error){
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try{

        const user = await User.findById({ _id:req.session.user_id})
        res.render('home',{user})

    }catch(error){
        console.log(error.message)
    }
}

const userLogout = async(req,res)=>{
    try{
        
        delete req.session.user_id;
        res.redirect('/')


    }catch(error){
        console.log(error.message)
    }
}
// user profile edit & update
const editLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id});

        if(userData){
            res.render('edit',{user:userData});
        }else{
            res.redirect('/home');
        }
    } catch (error) {
        console.log(error.message)
    }
}
const updateProfile = async(req,res)=>{
    try {
        if(req.file){
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}});
        }else{
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}});
        }

        res.redirect('/home');
        
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}  