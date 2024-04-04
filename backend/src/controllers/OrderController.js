import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponseHandler.js";
import { Order } from "../models/order.model.js";


const fetchOrder = asyncHandler(async(req, res)=>{
    const id = req.user._id;

    if(!id){
        throw new ApiErrors(400, "Invalid request")
    }

    const order = await Order.find({userId: id}).sort({createdAt: -1});

    if(!order){
        return res
        .status(404)
        .json(
            new ApiResponse(
                404,
                null,
                "No order found"
            )
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            order,
            "Order fetched successfully"
        )
    )
})


 const fetchAllOrders = asyncHandler(async(req, res) => {
    try {
        const orders = await Order.find({}).sort({createdAt: -1});

        if(!orders){
            return res
            .status(404)
            .json(
                new ApiResponse(
                    404,
                    null,
                    "No order found"
                )
            )
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                orders,
                "Order fetched successfully"
            )
        )

    } catch (error) {
        console.log("ERROR WHILE FETCHING ORDERS",error);
        return res
        .status(500)
        .json(
            new ApiResponse(
                500,
                null,
                "Internal server error"
            )
        )
    }
})

const deleteDeliveredOrder = asyncHandler(async(req, res) => {
    const id = req.params._id;

    if(!id){
        throw new ApiErrors(400, "Invalid request")
    }

    const order = await Order.findByIdAndDelete(id);

    //console.log(order);

    if(!order){
        return res
        .status(404)
        .json(
            new ApiResponse(
                404,
                null,
                "No order found"
            )
        )
    }

    //console.log(order);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            order,
            "Order deleted successfully"
        )
    )
})


export {
    fetchOrder,
    fetchAllOrders,
    deleteDeliveredOrder
}