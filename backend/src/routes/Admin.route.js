import { Router } from 'express';
import { adminLogin } from "../controllers/AdminController.js";

const router = Router();

router.route("/admin-login").post(adminLogin)

export default router;