const Category = require("../models/category")


//Find 
exports.getCategoryById = (req,res,next,id) => {

    Category.findById(id).exec((err,cate) => {

        if(err)
        {
            return res.status(400).json({
                error: "Category not found in DB"
            })
        }

        req.Category = cate;
        next();

    })
  
}

// Create Category
exports.createCategory = (req,res) => {

    const category = new Category(req.body);
    category.save((err,category) => {
        if(err)
        {
            return res.status(400).json({
                error: "NOT able to save category in DB "
            })
        }

        res.json({ category })
    })

}

exports.getCategory = (req,res) => {

    return res.json(req.category)
}

exports.getAllCategory = (req,res) => {

    Category.find().exec((err,categories) => {
        if(err)
        {
            return res.status(400).json({
                error: "NO Categories ",err
            })
        }
        res.json(categories)


    })
}

exports.updateCategory = (req,res)  => {

    const category = req.Category;
    category.name = req.body.name;

    category.save((err , updatedCategory) => {
        if(err)
        {
            return res.status(400).json({
                error: "Fail to update Category  ",err
            })   
        }
        res.json(updatedCategory)
    })


}

exports.removeCategory = (req,res) => {
    const category = req.Category

    category.remove((err,removeCate) => {
        
        if(err)
        {
            return res.status(400).json({
                error: "Fail to delete category",err
            })   
        }
        res.json({
            message:`Success Delete ${removeCate}`
        })

    })
} 


//ObjectId("5f363d5ad7226f27719dc819")