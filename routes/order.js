const express = require("express")
const router = express.Router()


const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getUserById,pushOrderInPurchaseList} = require("../controllers/user")
const {updateStock} = require("../controllers/product");

const { getOrderById ,getAllOrders ,updateStatus,getOrderStatus,createOrder} = require("../controllers/order");

//Params
router.param("userId" , getUserById)
router.param("orderId" , getOrderById)



//Routes

//create
router.post("/order/create/:userId", 
    isSignedIn, 
    isAuthenticated, 
    pushOrderInPurchaseList, 
    updateStock,
    createOrder
)


//read
router.get("/order/all/:userId", isSignedIn,isAuthenticated,isAdmin,getAllOrders)

//Status of Orders
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus )

//update
router.put("order/:orderId/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)

module.exports =  router;
