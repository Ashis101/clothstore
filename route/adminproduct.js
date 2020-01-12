const express=require('express')
const route=express.Router()
const control=require('../controller/adminprocon')
const protect=require('../routeprotect/routeprotect')

route.get('/addproduct',protect.user,control.getaddproduct)
route.post('/addproduct',protect.user,control.postaddproduct)
route.get('/items',protect.user,control.getallitems)
route.get('/addedproduct',protect.user,control.getadminitems)
route.get('/edit/:id',protect.user,control.getedititems)
route.post('/edit/:id',protect.user,control.postedititems)

module.exports=route

