import { Router } from 'express';
import { 
    createAddress,
    updateAddress,
} from "../controllers/AddressController.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route("/add-address").post(upload.none(), createAddress)

router.route("/update-address/:_id").patch(verifyJWT, updateAddress)

export default router;