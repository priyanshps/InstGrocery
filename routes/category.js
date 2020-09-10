const express = require("express")
const router = express.Router()

const { getCategoryById,
        createCategory,
        getCategory,
        getAllCategory, 
        updateCategory,
        removeCategory} = require("../controllers/category")



const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

router.param("userId",getUserById)
router.param("categoryId",getCategoryById)


//Routes
//Insert Category
router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory)

//Get One Category By ID
router.get("/category/:categoryId" ,getCategory)

// Get All Category READ
router.get("/categories" ,getAllCategory)

//UPDATE 
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory)

//DELETE
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,removeCategory)


module.exports = router;