import express from 'express';
import { home, login, register, userList, userEdit } from '../controllers/files-controller.js';
import { verifyToken, redirectIfAuthenticated } from '../utils/auth.js';

const router = express.Router();

router.get('/', verifyToken, home);
router.get('/login', redirectIfAuthenticated, login);
router.get('/register', redirectIfAuthenticated, register);
router.get('/users', verifyToken, userList);
router.get('/users/edit', verifyToken, userEdit);

export default router;
