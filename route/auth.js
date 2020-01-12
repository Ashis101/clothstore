const express=require('express')
const route=express.Router()
const con=require('../controller/authcon')
const {check,body}=require('express-validator')

route.get('/login',con.getlogin)

route.post('/login',con.postlogin)
route.get('/signup',con.getsignup)

route.post('/signup',[
    check('email')
    .isEmail()
    .withMessage('Please Enter Valid Email'),
   body('password')
   .isAlphanumeric()
   .isLength({max:5})
   .withMessage('Password Must be alphanumeric and maximam length 5'), 
   body('confpass') 
   .custom((value,{req})=>{
        if(value != req.body.password){
            throw new Error('Password Does Not Match ')
        }
        return true
   })
    
    ],con.postsignup)
route.post('/logout',con.logout)

route.get('/reset',con.reset)
route.post('/reset',con.postreset)

route.get('/resetpass/:id',con.resetpass)
route.post('/resetpass',con.postresetpass)

module.exports=route

