const Product=require('../model/product')
const Order=require('../model/order')
const stripe=require('stripe')('sk_test_v9xvdBLXtRUYc66BFld7DWH500opVx0Jz9')
exports.getcart=((req,res)=>{
    req.user
    .populate('cart.item.productid')
    .execPopulate()
    .then(user=>{
        const product=user.cart.item
        res.render('product/cart.ejs',{
            pagetitle:'AddtoCart',
            product:product
            
        })
    })
    .catch(err=>console.log(err))



})

exports.postcart=(req,res)=>{
    const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addtocart(product);
    })
    .then(result => {
      res.redirect('/cart');
    });
    
}

exports.deleteitem=(req,res)=>{
  const prodId = req.body.productId;
  req.user
    .deleteitem(prodId).then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));

}

exports.postorder=(req,res)=>{
  req.user
  .populate('cart.item.productid')
  .execPopulate()
  .then(user=>{
    let data=user.cart.item.map(i=>{
      return {product:{...i.productid._doc},quantity:i.quantity}
    })
    
    const orders=new Order({
      products:data,
      user:{
        name:req.user.email,
        userid:req.user
      },
      
  })
  return orders.save()
  })
  .then(result => {
    return req.user.clearcart();
  })
  .then(()=>{
    return  res.redirect('/orders')
  })
  .catch(err=>console.log(err))


}

exports.getorder=(req,res)=>{
  Order.find({'user.userid':req.user._id})
  .then(order => {
    res.render('product/order', {
      pagetitle: 'Your Orders',
      orders: order
    });
  })
  .catch(err=>{console.log(err)})

}

exports.getcheckout=(req,res,next)=>{
  let products
  let total=0
  let userdata
  req.user
  .populate('cart.item.productid')
  .execPopulate()
  .then(user => {
    userdata=user
    console.log(user)
     products = user.cart.item;
     total = 0;
    products.forEach(p => {
      total += p.quantity * p.productid.price;
    });
    return stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:products.map(p=>{
        return {
          name:p.productid.title,
          amount:p.productid.price * 100,
          currency:'inr',
          quantity:p.quantity
        }
      }),
      success_url:req.protocol + '://' + req.get('host') + '/checkout/success',
      cancel_url:req.protocol + '://' + req.get('host') + '/checkout/cancel'

    })
  })
  .then(session=>{
    res.render('product/checkout', {
      pagetitle: 'Checkout', 
      user:userdata.name,
      totalSum: total,
      sessionid:session.id
    });
  })
  .catch(err=>console.log(err))

    
   }  
   
 
 


