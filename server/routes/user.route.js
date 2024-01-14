import express from 'express';
import {test, updateUser} from "../controllers/user.controller.js";
import { verifyUser } from '../utills/verifyuser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyUser, updateUser);

export default router;