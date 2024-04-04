import express from 'express'
import { 
    fetchOrder,
    fetchAllOrders,
    deleteDeliveredOrder
} from '../controllers/OrderController.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';

const router = express.Router()

router.route("/fetch-order").get(verifyJWT, fetchOrder)

router.route("/fetch-all-orders").get(verifyJWT, verifyAdmin, fetchAllOrders)

router.route("/delete-delivered-orders/:_id").delete(verifyJWT, verifyAdmin, deleteDeliveredOrder)

export default router;