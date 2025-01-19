import express from 'express';
import { LogIn, LogOut, SignUp, UpdateProfile,CheckAuth } from '../controllers/auth.controller.js';
import {ProtectedRoute} from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/SignUp',SignUp)
router.post('/LogIn',LogIn)
router.post('/LogOut',LogOut)

router.put('/Update-Profile',ProtectedRoute,UpdateProfile)

router.get('/check',ProtectedRoute,CheckAuth)

export default router;