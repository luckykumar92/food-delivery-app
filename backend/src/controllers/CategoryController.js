import { asyncHandler } from "../utils/asyncHandler.js"
import { Category } from "../models/Category.model.js"
import { ApiErrors } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponseHandler.js"
import { uploadOnCloudinary } from "../utils/cloundinary.js"
import { v2 as cloudinary } from 'cloudinary'

const createCategory = asyncHandler(async (req, res) => {

    const { title , value} = req.body

    if(!title){
        throw new ApiErrors(400, "Title is required")
    }

    //console.log(req);

    const existedCategory = await Category.findOne({
        $or: [{title}]
    })

    if(existedCategory){
        throw new ApiErrors(400, "Category already exists")
    }

    const categoryImageLocalPath = req.file?.path
    //console.log(categoryImageLocalPath);

    if(!categoryImageLocalPath){
        throw new ApiErrors(400, "Category image is required")
    }

    const categoryImage = await uploadOnCloudinary(categoryImageLocalPath, "Category-Image")

    if(!categoryImage){
        throw new ApiErrors(400, "Something went wrong while uploading category image")
    }

    const category = await Category.create({
        title,
        value,
        categoryImage: categoryImage.url
    })

    if(!category){
        throw new ApiErrors(400, "Something went wrong while creating category")
    }
        
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            category,
            "Category created successfully"
        )
    )
})

const getAllCategories = asyncHandler(async (req, res) => {
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            await Category.find({}),
            "All categories"
        )
    )
})

const deleteCategory = asyncHandler(async (req, res) => {
    const _id  = req.params._id

    if(!_id){
        throw new ApiErrors(400, "Category id is required")
    }

    const category = await Category.findByIdAndDelete(_id)

    if(!category){
        throw new ApiErrors(400, "Something went wrong while deleting category")
    }

    const imageToBeDeleted = category.categoryImage;

    const urlParts = imageToBeDeleted.split("/");
    const n = urlParts.length;
    const inp = urlParts[n - 2] + "/" + urlParts[n - 1];
    const newInp = inp.split(".")
    //console.log(newInp[0]);

    if (newInp) {
        await cloudinary.api.delete_resources(newInp[0]);
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            category,
            "Category deleted successfully"
        )
    )
})

const getCategoryByTitle = asyncHandler(async (req, res) => {
    const title = req.params.title

    if(!title){
        throw new ApiErrors(400, "Category id is required")
    }

    const category = await Category.findOne({title: title})

    if(!category){
        throw new ApiErrors(400, "Something went wrong while getting category")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            category,
            "Category fetched successfully"
        )
    )
})

export {
    createCategory,
    getAllCategories,
    deleteCategory,
    getCategoryByTitle
}