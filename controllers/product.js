const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")
const { isSignedIn, isAuthenticated, isAdmin } = require("./auth")
const router = require("../routes/auth")
const product = require("../models/product")
const category = require("../models/category")

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product) =>{
        if(err)
        {
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = product;
        next();
    })
}

exports.createProduct = (req,res) => {

    let form = new formidable.IncomingForm() 
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err)
        {
            return res.status(400).json({
                error: "Problem wth image"
            })
        }

        const {name, description, price, stock, category} = fields
        
        if(!name || !description || !price || !stock || !category )
        {
            return res.status(400).json({
                error: "Please include all fields"
            })
        }

       let product = new Product(fields)
        

       
        //handle file here
        if(file.photo)
        {
            if(file.photo.size > 3000000)
            {
                return res.status(400).json({
                    error:"File Size to big "
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
          
        }
       

        // console.log("product",product);
        product.save((err,product) => {
            if(err)
            {
                return res.status(400).json({
                    error: "Saving product failed"
                })
            }

            res.json(product);

        })
    })

   

}

exports.getProduct = (req,res) => {

    req.product.photo = undefined
    return res.json(req.product)
}

//Middleware 
exports.photo = (req,res,next) => {

    if(req.product.photo.data){

        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()

}


//Delete controllers
exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err)
        {
            return res.status(400).json({
                error: "Failed to delete product"
            })
        }
        res.json({
            message: "Deleted Success ",deletedProduct
        })
    })
}

//Update controllers
exports.updateProduct = (req,res) => {


    let form = new formidable.IncomingForm() 
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err)
        {
            return res.status(400).json({
                error: "Problem wth image"
            })
        }

        const {name, description, prize, stock, category} = fields
        
       
        //updation code
        let product = req.product
        product = _.extend(product,fields)
        

       
        //handle file here
        if(file.photo)
        {
            if(file.photo.size > 3000000)
            {
                return res.status(400).json({
                    error:"File Size to big "
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
          
        }
       

        // console.log("product",product);
        product.save((err,product) => {
            if(err)
            {
                return res.status(400).json({
                    error: "Updation product failed"
                })
            }

            res.json(product);

        })
    })

    
}

//Listing route 
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  
    Product.find()
      .select("-photo")
      .populate("category")
      .sort([[sortBy, "asc"]])
      .limit(limit)
      .exec((err, products) => {
        if (err) {
          return res.status(400).json({
            error: "NO product FOUND"
          });
        }
        res.json(products);
      });
  };

exports.updateStock = (req, res, next) => {

    let myOperations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: {
                    _id: product._id
                },
                update: {$inc: {stock: -product.count,sold: +product.count}}
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err,products) => {
        if(err)
        {
            return res.status(400).json({
                error: "Bulk Operation Fail"
            })
        }
    })
}


exports.getAllUniqueCategory = (req, res) => {

    Product.distinct("category" ,{} ,(err,category) => {
        if(err)
        {
            return res.status(400).json({
                error: "No Category Found"
            })
        }
    })
} 