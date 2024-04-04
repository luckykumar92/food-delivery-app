import { Router } from "express";
import { 
    addFood,
    deleteFoodById,
    foodAvailability,
    getAllFoods,
    getFoodById, 
    updateFoodById,
    getFoodsByCategory
} from "../controllers/FoodController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add-food").post(verifyJWT, verifyAdmin, upload.fields([{name:"foodImage", maxCount: 1}]), addFood);

router.route("/get-food-by-id/:_id").get(verifyJWT, getFoodById)

router.route("/update-food/:_id").patch(verifyJWT, verifyAdmin, updateFoodById)

router.route("/delete-food/:_id").delete(verifyJWT, verifyAdmin, deleteFoodById);

router.route("/get-all-foods").get( getAllFoods);

router.route("/food-availability/:_id").patch(verifyJWT, verifyAdmin, foodAvailability);

router.route("/get-foods-by-category/:_id").get(getFoodsByCategory);

export default router;