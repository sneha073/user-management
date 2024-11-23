const express = require("express");
const admin_route = express();
const dotenv = require("dotenv")
dotenv.config();

const session = require("express-session");
const config = require("../config/config");
// admin_route.use(session({secret:config.sessionSecret}));

admin_route.use(session({
    secret: process.env.SESSIONSECRET,
     resave: false,
    saveUninitialized: false,
}));

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const auth = require("../middleware/adminAuth")
  
const adminController = require("../controllers/adminController");

admin_route.get('/',auth.isLogout,adminController.loadLogin);


admin_route.post('/verify',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',auth.isLogin,adminController.logout);

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard);

admin_route.get('/dashboard/search',adminController.searchUser)

admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad);

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad);

admin_route.post('/edit-user',adminController.updateUsers);

admin_route.get('/delete-user',adminController.deleteUser);

admin_route.post('/new-user',adminController.addUser);

admin_route.get('*',function(req,res){
    res.render('/admin')
})

module.exports = admin_route;