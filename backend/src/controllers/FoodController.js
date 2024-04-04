import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponseHandler.js";
import { uploadOnCloudinary } from "../utils/cloundinary.js";
import { Food } from "../models/Food.model.js";
import { Category } from "../models/Category.model.js";
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const addFood = asyncHandler(async (req, res) => {

    try {
        const {title, category, description, price } = req.body
    
        if([title || category || description || price].some((field) => field?.trim() === "")){
            throw new ApiErrors(400, "All fields are required")
        }
    
        const existedFood = await Food.findOne({
            $or: [{title}]
        })
    
        if(existedFood){
            throw new ApiErrors(400, "Food already exists")
        }
    
        //console.log(req.file);
    
        const foodImageLocalPath = req.files?.foodImage[0]?.path;
    
        if(!foodImageLocalPath){
            throw new ApiErrors(400, "Food image is required")
        }
    
        const foodImage = await uploadOnCloudinary(foodImageLocalPath, "Food-Image")
    
        if(!foodImage){
            throw new ApiErrors(500, "Something went wrong while uploading food image")
        }
    
        const food = await Food.create({
            title,
            category,
            description,
            price,
            foodImage: foodImage.url,
        })
    
        if(!food){
            throw new ApiErrors(500, "Something went wrong while creating food")
        }
    
        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                food,
                "Food created successfully"
            )
        )
    } catch (error) {
        console.log("ERROR OCCURED AT ADD FOOD API", error);
        fs.unlinkSync(`${req.files?.foodImage[0]?.path}`)
        return res
        .status(error.statusCode)
        .json(
            new ApiResponse(
                error.statusCode,
                error.message,
                "Something went wrong while creating food"
            )
        )
    }
})

const getFoodById = asyncHandler(async (req, res) => {
    const foodId = req.params._id

    if(!foodId){    
        throw new ApiErrors(400, "FoodId is not reaching the controller")
    }

    const food = await Food.findById(foodId)

    if(!food){
        throw new ApiErrors(404, "Food not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            food,
            "Food found"
        )
    )
})

const deleteFoodById = asyncHandler(async (req, res) => {
    const foodId = req.params._id

    //console.log(req.params);

    if(!foodId){    
        throw new ApiErrors(400, "FoodId is not reaching the controller")
    }

    const food = await Food.findByIdAndDelete(foodId)

    if(!food){
        throw new ApiErrors(404, "Food not found")
    }

    const imageToBeDeleted = food.foodImage;

    const urlParts = imageToBeDeleted.split("/");
    const n = urlParts.length;
    const inp = urlParts[n - 2] + "/" + urlParts[n - 1];
    const newInp = inp.split(".")
    //console.log(newInp[0]);

    if (newInp) {
        await cloudinary.api.delete_resources(newInp[0]);
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            food,
            "Food deleted"
        )
    )   
})

const foodAvailability = asyncHandler(async (req, res) => {
    const foodId = req.params._id

    if(!foodId){
        throw new ApiErrors(400, "FoodId is not reaching the controller")
    }

    const food = await Food.findById(foodId)

    if(!food){
        throw new ApiErrors(404, "Food not found")
    }

    const isAvailable = food.isAvailable

    food.isAvailable = !isAvailable

    await food.save()


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            !isAvailable,
            "Food availability toggled successfully"
        )
    )

})

const updateFoodById = asyncHandler(async (req, res) => {

    const {title, isAvailable, category, description, price } = req.body

    if(!(title || category || description || price)){
        throw new ApiErrors(400, "Fill anyone field to update")
    }

    //console.log(req.params);

    const foodId = req.params._id

    if(!foodId){    
        throw new ApiErrors(400, "FoodId is not reaching the controller")
    }

    const food = await Food.findByIdAndUpdate(
        foodId,
        {
            title,
            category,
            description,
            price,
            isAvailable
        },
        {
            new: true,
            runValidators: true,
        }
    )

    if(!food){
        throw new ApiErrors(404, "Food not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            food,
            "Food updated"
        )
    )
})

const getAllFoods = asyncHandler(async (req, res) => {
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            await Food.find({}),
            "All foods"
        )
    )
})

const getFoodsByCategory = asyncHandler(async (req, res) => {
    const _id = req.params._id

    if(!_id){
        throw new ApiErrors(400, "CategoryId is not reaching the controller")
    }

    const foods = await Food.find({category: _id})

    if(!foods){
        throw new ApiErrors(404, "Foods not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            foods,
            "Foods found"
        )
    )

})

export {
    addFood,
    getFoodById,
    deleteFoodById,
    foodAvailability,
    updateFoodById,
    getAllFoods,
    getFoodsByCategory
}