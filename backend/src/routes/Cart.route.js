import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { 
    addProductToCart,
    fetchUserCart,
    removeProductFromCart,
    incrementProductQuantity,
    decrementProductQuantity
} from '../controllers/CartController.js'

const router = Router()

router.route("/add-to-cart").post(verifyJWT , addProductToCart)

router.route("/fetch-user-cart").get(verifyJWT , fetchUserCart)

router.route("/remove-from-cart/:_id").delete(verifyJWT , removeProductFromCart)

router.route("/increment-product-quantity/:_id").patch(verifyJWT , incrementProductQuantity)

router.route("/decrement-product-quantity/:_id").patch(verifyJWT , decrementProductQuantity)

export default router