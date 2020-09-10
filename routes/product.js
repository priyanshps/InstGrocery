const express = require("express")
const router = express.Router()


const{
    getProductById ,
    createProduct ,
    getProduct ,
    photo ,
    deleteProduct, 
    updateProduct,
    getAllProducts,
    getAllUniqueCategory
} = require("../controllers/product")

const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {} = require("../controllers/category")

router.param("userId" ,getUserById)
router.param("productId", getProductById)


//All Routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin , createProduct)

router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId" , photo)


//Delete Product
router.delete(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteProduct
)


//Update Product
router.put(
    "/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct
)

router.get("/products", getAllProducts)

router.get("/products/categories", getAllUniqueCategory)



module.exports = router