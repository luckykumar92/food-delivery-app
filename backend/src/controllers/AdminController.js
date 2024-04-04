import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponseHandler.js";
import { generateAccessAndRefreshToken } from "../controllers/UserController.js";

const adminLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    //console.log(req.body);

    if (!username || !password) {
        throw new ApiErrors(400, "Username and password are required");
    }

    const user = await User.findOne({ username: username });

    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    if (password !== user.password) {
        throw new ApiErrors(400, "Password is incorrect");
    }

    if (user.role !== "admin") {
        throw new ApiErrors(400, "You are not admin");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const logedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const option = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, option)
        .cookie("accessToken", accessToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user: logedInUser,
                    accessToken,
                },
                "User loged in successfully"
            )
        );
})

export {
    adminLogin
}