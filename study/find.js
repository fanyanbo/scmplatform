var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = require("./db");

var productSchema = new mongoose.Schema({
    operateType:Number,
    gerritState:Number,
    userName:String,
    desc:String,
    memorySize:String,
    chipModel:String,
    androidVersion:String,
    model:String,
    chip:String,
    targetProduct:String,
    mkFile:Schema.Types.Mixed,
    configFile:Schema.Types.Mixed
});

productSchema.statics.productQuery = function (whereStr,optStr,callback) {

    this.model("Product").find(whereStr,optStr,callback);
};

var productModel = db.model("Product", productSchema);

module.exports = productModel;

productModel.productQuery({"model":"G7","chip":"9R59"},{"targetProduct":1},function(err, result){
    console.log(result);
});
