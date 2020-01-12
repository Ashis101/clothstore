const express=require('express')
const route=express.Router()
const usercon=require('../controller/user')
const protect=require('../routeprotect/routeprotect')
route.get('/',(req,res)=>{
    res.render('home.ejs',{pagetitle:'Home'})
})
route.get('/about',(req,res)=>{
    res.render('about')
})

route.get('/cart',protect.user,usercon.getcart)
route.post('/cart',protect.user,usercon.postcart)
route.post('/cart-delete',protect.user,usercon.deleteitem)
route.get('/checkout',protect.user,usercon.getcheckout)
route.get('/checkout/success',usercon.postorder)
route.get('/checkout/cancel',usercon.getcheckout)
route.get('/orders',protect.user,usercon.getorder)


module.exports=route
