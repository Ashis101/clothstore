const bcrypt=require('bcryptjs')
const User=require('../model/auth')
const nodemailer=require('nodemailer')
const crypto=require('crypto')
const key=require('../config/conf')
const {validationResult}=require('express-validator')


const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:key.email.user,
        pass:key.email.pass
    }
})

exports.getsignup=(req,res)=>{
    const err=req.flash('error')
    console.log(err[0])
    res.render('auth/signup',{
        pagetitle:'signup',
        error:err
        
    })
}

exports.postsignup=(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    const name=req.body.name
    const error=validationResult(req)
    console.log(error.array())
    if(!error.isEmpty()){
        res.render('auth/signup',{
            pagetitle:'signup',
            error:error.array()[0].msg
            
        })
    }

    User.findOne({email:email})
    .then(valid=>{
        if(valid){
            req.flash('error','E-Mail already exists')
            return  res.redirect('/signup')
        }
       return bcrypt.hash(password,10)
       .then(haspass=>{
            const user=new User({
                name:name,
                email:email,
                password:haspass,
                cart: { item: []},
                usertype:'user'
            })
            user.save().then(d=>{
                res.redirect('/login')
            })
       })

    })
    .then(ax=>{
        return transporter.sendMail({
            to:email,
            from:'ashisbanerjee3256@gmail.com',
            subject:'Signup successfully completed',
            html:'<h1>You succesfully signup!</h1>'
        })
    })
    .catch(err=>console.log(err))
}

exports.getlogin=(req,res)=>{
    let error=req.flash('error')
    console.log(req.session.user)
    res.render('auth/login',{
        pagetitle:'login',
        error:error
    })
}

exports.postlogin=(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    const error=validationResult(req)
    if(!error.isEmpty()){
        res.render('auth/login',{
            pagetitle:'login',
            error:error.array()[0].msg
        })
    }

    User.findOne({email:email})
    .then(valid=>{
        if(!valid){
            req.flash('error','Username is Unvalid')
            return res.redirect('/login')
        }       
        return bcrypt.compare(password,valid.password)
        .then(data=>{
            if(data){
                req.session.login=true
                req.session.user=valid.usertype
                req.session.userid=valid._id
                req.session.name=valid.name
                return  req.session.save(err=>{
                    console.log(err)
                    res.redirect('/items')
                })
            }
            return res.redirect('/login')
           
        })
        .catch(err=>{
            console.log(err)
            res.redirect('/login')
        })
    })
    .catch(err=>console.log(err))


}

exports.logout=(req,res)=>{
     req.session.destroy(err=>{
        console.log(err)
        res.redirect('/login')
    })
}

exports.reset=(req,res)=>{
    res.render('auth/reset',{
        pagetitle:'reset',
        error:req.flash('error')
    })
}

exports.postreset=(req,res)=>{
    
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            return console.log(err)
        }
        const token=buffer.toString('hex')
        const email=req.body.email
        User.findOne({email:email})
        .then(data=>{
            if(!data){
                req.flash('error', 'No account with that email found.');
               return res.redirect('/reset')
            }
            data.resettoken=token
            data.resettokentime=Date.now() +3600000
            return data.save()
            
        })
        .then(data=>{
            res.status(200).redirect('/login')
            return transporter.sendMail({
                to:req.body.email,
                from:'ashisbanerjee3256@gmail.com',
                subject:'Reset password',
                html:`Do Reset password Through this link
                        <a href='http://localhost:7410/resetpass/${token}'>Reset Password</a>
                `

            })
        })
        .catch(err=>{
            console.log(err)
        })
    })


}

exports.resetpass=(req,res)=>{
    token=req.params.id
    User.findOne({resettoken:token,resettokentime:{$gt:Date.now()}})
    .then(data=>{
        res.render('auth/resetpassword',{
            pagetitle:'Reset Password',
            token:token,
            userid:data._id
        })
    })
    .catch(err=>console.log(err))

}

exports.postresetpass=(req,res)=>{
    const token=req.body.token
    const id=req.body.userid
    const newpassword=req.body.newpass
    let user
    User.findOne({_id:id,resettoken:token})
    .then(users=>{
        user=users
        return bcrypt.hash(newpassword,10)
    })
    .then(haspass=>{
        user.password=haspass
        user.resettoken=undefined
        user.resettokenexpire=undefined
        return user.save()
    })
    .then(()=>{
        res.redirect('/login')

    })
    .catch(err=>{
        console.log(err)
    })
}
    
