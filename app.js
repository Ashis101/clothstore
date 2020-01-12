const express=require('express')
const app=express()
const path=require('path')
const port=7411
const body=require('body-parser')
const mongoose=require('mongoose')
const conf=require('./config/conf')
const session=require('express-session')
const sessionstore=require('connect-mongodb-session')(session)
const flash=require('connect-flash')
const csrf=require('csurf')


const User=require('./model/auth')
const authroute=require('./route/auth')
const homeroute=require('./route/user')
const adminproduct=require('./route/adminproduct')
const errorpage=require('./errorpage/error500')

app.use(body.urlencoded({extended:false}))
app.set('view engine','ejs')
app.set('views','view')
app.use(express.static(path.join(__dirname,'style')))
const mongosession=new sessionstore({
    uri:conf.mongoUri.db,
    collection:'session'
})

app.use(session({
    secret:'mysecrete',
    saveUninitialized:false,
    resave:false,
    store:mongosession
}))
const csurfprotect=csrf()
app.use(csurfprotect)
app.use(flash())
app.use((req,res,next)=>{
    res.locals.csrf=req.csrfToken()
    res.locals.isadmin=req.session.user
    res.locals.login=req.session.login
    res.locals.name=req.session.name
    next( )
})


app.use((req,res,next)=>{
    User.findById(req.session.userid)
    .then(user=>{
        req.user=user
        next()
    })
    .catch(err=>console.log(err))
})

app.use(homeroute)
app.use(adminproduct)
app.use(authroute)
app.use('/500',errorpage)
app.listen(port,()=>{console.log(`Server Running on ${port}`)})
mongoose.connect(conf.mongoUri.db,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Db Started')
})
