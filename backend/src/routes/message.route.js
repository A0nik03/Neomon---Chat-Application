import express from "express";
import { ProtectedRoute } from "../middleware/auth.middleware.js";
import { GetMessages, GetUsersForSideBar, SendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get('/users',ProtectedRoute,GetUsersForSideBar);
router.get('/:id',ProtectedRoute,GetMessages);

router.post('/send/:id',ProtectedRoute,SendMessage);

export default router;