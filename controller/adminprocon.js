const Product=require('../model/product')
exports.getaddproduct=(req,res)=>{
    res.render('adminproduct/addproduct.ejs',{
        pagetitle:'AddProduct'
    })
}

exports.postaddproduct=(req,res)=>{
    const image=req.body.image
    const title=req.body.title
    const price=req.body.price
    const details=req.body.details
    // if(!req.user._id){
    //     return  res.redirect('/500')
    // }
    const Products=new Product({
        image:image,
        title:title,
        price:price,
        description:details,
        userid:req.user._id
    })
    Products.save()
    .then(data=>{
        res.redirect('/items')
    })
    .catch(err=>{
       
        console.log('Id is Not FOund')
        console.log(err)
    })
    

}

let pageitem=2
exports.getallitems=(req,res)=>{
    let page =+ req.query.page || 1
    let totalitems
    
    Product.find()
    .countDocuments()
    .then(numproduct=>{
        totalitems=numproduct
      return  Product.find()
        .skip((page - 1)*pageitem)
        .limit(pageitem)
    })
    .then(product=>{
        
        res.render('product/products',{
            pagetitle:'All Items',
            data:product,
            hasnextpage:pageitem * page < totalitems,
            hasprevpage:page > 1,
            nextpage:page + 1,
            lastpage:page - 1 ,
            prevpage:page - 1,
            lastpage:Math.ceil(totalitems / pageitem),
            currentpage:page
        })
    })
    .catch(err=>{console.log(err)})
}

exports.getadminitems=(req,res)=>{
    Product.find()
    .then(product=>{
        
        res.render('adminproduct/adminproducts',{
            pagetitle:'All Items',
            data:product

        })
    })
    .catch(eerr=>{console.log(err)})

}

exports.getedititems=(req,res)=>{
    const id=req.params.id
    Product.findById(id)
    .then(data=>{
        console.log(data)
        res.render('adminproduct/editproduct',{
            pagetitle:'Editing',
            editdata:data
        })
    })
    .catch(err=>{
        console.log(err)
    })

}

exports.postedititems=(req,res)=>{
    const image=req.body.image
    const title=req.body.title
    const price=req.body.price
    const details=req.body.details
    const id=req.body.userid
    Product.findById(id)
    .then(udata=>{
        udata.image=image,
        udata.title=title,
        udata.price=price,
        udata.description=details
        udata.save()
        return res.redirect('/addedproduct')
    })
    .catch(err=>console.log(err))


}