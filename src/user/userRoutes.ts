import { Router } from "express";
import { GetUsersHandler, GetUserHandler, RegisterHandler, RegisterValidator } from "./userController.ts";

const router = Router();
router.post('/', RegisterValidator, RegisterHandler);

router.get('/', GetUsersHandler);

router.get('/:id', GetUserHandler);

export default router;