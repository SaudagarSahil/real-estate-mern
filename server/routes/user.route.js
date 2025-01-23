import express from 'express';
import {deleteUser, getUserListing, test, updateUser, getUser} from "../controllers/user.controller.js";
import { verifyUser } from '../utills/verifyuser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyUser, updateUser);
router.delete('/delete/:id', verifyUser, deleteUser);
router.get('/listings/:id', verifyUser, getUserListing);
router.get('/:id', verifyUser, getUser);

export default router;