import { Router } from "express";
import userController from "../controllers/user-controller";
const router = Router();
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth-middleware";

router.post('/registration',
  body('password').isLength({ min: 3, max: 32 }),
  userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

export default router;