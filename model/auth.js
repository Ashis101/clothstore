const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Authchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    cart:{
        item:[{
            productid:{type:mongoose.Schema.Types.ObjectId,ref:'Products',required:true},
            quantity:{type:Number,required:true}
        }]
    },
    resettoken:{type:String},
    resettokentime:{type:Date},
    usertype:{type:String,required:true}
})

Authchema.methods.addtocart=function(product){
    const cartproductindex=this.cart.item.findIndex(cp=>{
      return   cp.productid.toString() === product._id.toString()
    })
    let newquantity=1
    let updatecartitem=[...this.cart.item]
    if(cartproductindex >= 0){
        newquantity=this.cart.item[cartproductindex].quantity + 1
        updatecartitem[cartproductindex].quantity=newquantity
    }else{
        updatecartitem.push({
            productid:product._id,
            quantity:newquantity
        })

    }
    const updatecart={
        item:updatecartitem
    }
    this.cart=updatecart
    return this.save()
}

Authchema.methods.deleteitem=function(productid){
    const updatecart=this.cart.item.filter(cp=>{
        return cp.productid.toString() !== productid.toString()
    })
    this.cart.item=updatecart
    return this.save()
}

Authchema.methods.clearcart=function(){
    this.cart={item:[ ]}
    return this.save()
}

module.exports=mongoose.model('Users',Authchema)



