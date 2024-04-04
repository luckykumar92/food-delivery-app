import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiErrors } from '../utils/ApiErrors.js'
import  { ApiResponse } from '../utils/ApiResponseHandler.js'
import { Cart } from '../models/Cart.model.js'
import { Food } from '../models/Food.model.js'

const addProductToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id
    let { productId, quantity} = req.body

    if(!(userId && productId)){
        throw new ApiErrors(400, 'User and Product Id are required')
    }

    const existingProduct = await Cart.findOne({userId, productId})

    if(existingProduct){
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                existingProduct,
                "Product already exists in cart"
            )
        )
    }

    const food =await Food.findById(productId)
    //console.log(food);
    //console.log();

    if(!food){
        throw new ApiErrors(400, "Product is not available")
    }

    let totalPrice = food.price * quantity
    console.log(totalPrice);

    const addProduct = await Cart.create(
        {
            userId,
            productId,
            instruction: req.body.instruction,
            quantity,
            totalPrice
        }
    )

    if(!addProduct){
        throw new ApiErrors(500, "Something went wrong while adding product to cart")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            addProduct,
            "Product added to cart successfully"
        )
    )
})

const removeProductFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const _id = req.params._id

    if(!(userId && _id)){
        throw new ApiErrors(400, 'User and Product Id are required')
    }

    const existingProduct = await Cart.findOne({userId, _id})

    if(!existingProduct){
        throw new ApiErrors(400, "Product doesn't exist in cart")
    }

    const removeProduct = await Cart.deleteOne({userId, _id})

    if(!removeProduct){
        throw new ApiErrors(500, "Something went wrong while removing product from cart")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            removeProduct,
            "Product removed from cart successfully"
        )
    )
})

const fetchUserCart = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if(!userId){
        throw new ApiErrors(400, 'User Id is required')
    }

    const userCart = await Cart.find({userId})

    if(!userCart){
        throw new ApiErrors(500, "Something went wrong while fetching user cart")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            userCart,
            "User cart fetched successfully"
        )
    )
})

const incrementProductQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const _id = req.params._id
    const quantityLimit = 10
    
    if(!(userId && _id)){
        throw new ApiErrors(400, 'User and Product Id are required')
    }

    const existingProduct = await Cart.findOne({userId, _id})

    if(!existingProduct){
        throw new ApiErrors(400, "Product doesn't exist in cart")
    }

    const food =await Food.findById(existingProduct.productId)

    if(!food){
        throw new ApiErrors(400, "Product is not available")
    }


    if (existingProduct.quantity < quantityLimit) {
        existingProduct.quantity += 1
        existingProduct.totalPrice = food.price * existingProduct.quantity
    } else{
        return res.status(400).json(new ApiResponse(400, null, `Product quantity can't be more than ${quantityLimit}`));
    }

    const updatedProduct = await Cart.findByIdAndUpdate(_id, existingProduct, {new: true})

    if(!updatedProduct){
        throw new ApiErrors(500, "Something went wrong while updating product quantity")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedProduct,
            "Product quantity updated successfully"
        )
    )
})

const decrementProductQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const _id = req.params._id
    const quantityLimit = 1
    
    if(!(userId && _id)){
        throw new ApiErrors(400, 'User and Product Id are required')
    }

    const existingProduct = await Cart.findOne({userId, _id})

    if(!existingProduct){
        throw new ApiErrors(400, "Product doesn't exist in cart")
    }

    const food =await Food.findById(existingProduct.productId)

    if(!food){
        throw new ApiErrors(400, "Product is not available")
    }

    if(existingProduct.quantity > quantityLimit){
        existingProduct.quantity -= 1
        existingProduct.totalPrice = food.price * existingProduct.quantity
    } else {
        return res.status(400).json(new ApiResponse(400, null, `Product quantity can't be less than ${quantityLimit}`));
    }

    const updatedProduct = await Cart.findByIdAndUpdate(
        _id, 
        existingProduct, 
        {
            new: true
        }
    )

    if(!updatedProduct){
        throw new ApiErrors(500, "Something went wrong while updating product quantity")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedProduct,
            "Product quantity updated successfully"
        )
    )
})

export { 
    addProductToCart,
    removeProductFromCart,
    fetchUserCart,
    incrementProductQuantity,
    decrementProductQuantity
}
    