const mongoose=require('mongoose')
const Productschema=mongoose.Schema({
    image:{type:String,required:true},
    title:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    userid:{type:String,required:true}

})

module.exports=mongoose.model('Products',Productschema)