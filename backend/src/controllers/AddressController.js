import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiErrors } from '../utils/ApiErrors.js'
import  { ApiResponse } from '../utils/ApiResponseHandler.js'
import { Address } from '../models/Address.model.js'

const createAddress = asyncHandler(async (req, res) => {
    const {addressLine1, addressLine2, city, state, pincode, deliveryInstruction, userId} = req.body

    //console.log(req.body);

    if([addressLine1, city, state, pincode].some((field) => field?.trim() === "")){
    return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                {},
                "Please fill all required fields"
            )
        )
    }

    const existingAddress = await Address.findOne({userId: userId})

    if(existingAddress){
        return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                {},
                "Address already exists"
            )
        )
    }

    const address = await Address.create(
        {
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            deliveryInstruction,
            userId
        }
    )

    if(!address){
        return res
        .status(500)
        .json(
            new ApiResponse(
                500,
                {},
                "Something went wrong on the server-side"
            )
        )
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            address,
            "Address created successfully"
        )
    )
})

const updateAddress = asyncHandler(async (req, res) => {
    const { AddressLine1, AddressLine2, city, state, pincode, deliveryInstruction } = req.body

    if(!(AddressLine1 || AddressLine2 || city || state || pincode || deliveryInstruction)){
        throw new ApiErrors(400, "Please fill atleast one field")
    }

    //console.log(req.params._id);

    const updatedAddress = await Address.findOneAndUpdate(
        {userId: req.user._id},
        {
            ...(AddressLine1 && {AddressLine1}),
            ...(AddressLine2 && {AddressLine2}),
            ...(city && {city}),
            ...(state && {state}),
            ...(pincode && {pincode}),
            ...(deliveryInstruction && {deliveryInstruction})
        },
        {
            new: true,
            runValidators: true
        }
    )

    //console.log(updatedAddress);

    if(!updatedAddress){
        throw new ApiErrors(404, "Address not found")
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedAddress,
            "Address updated successfully"
        )
    )
})

export { 
    createAddress,
    updateAddress
}

