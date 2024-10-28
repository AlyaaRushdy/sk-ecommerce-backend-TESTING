var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var products = new Schema(
  {
    sku: { type: String, required: true },
    title: { type: String, required: true },
    price: {
      base: { type: Number, required: true },
      discount: { type: Number, default: 0 },
    },
    description: { type: String, required:false },
    images: [ {type: String , required: false, }, ],
    categoryId: { type: Schema.Types.ObjectId, ref:"category", required: false },
    quantity: { type: Number, required: true, default: 1},
    scent :{ type:String,  required:false },
    volume :{type:String , required:false},
    gender:{type:String ,required:false},
    rating: { type: Number,default: 0 },
    status: { type: String, required: true},
},
  
  { timestamps: true }
);

module.exports = mongoose.model('Product', products);