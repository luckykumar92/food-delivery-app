import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import { 
    createCategory, 
    getAllCategories ,
    deleteCategory,
    getCategoryByTitle
} from "../controllers/CategoryController.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-category").post(verifyJWT, verifyAdmin, upload.single("categoryImage"), createCategory);

router.route('/get-all-categories').get(getAllCategories);

router.route("/delete-category/:_id").delete(verifyJWT,verifyAdmin, deleteCategory);

router.route("/get-category-by-title/:title").get(verifyJWT, getCategoryByTitle);

export default router;