import { Router } from "express";
import {register ,login ,refresh ,logout} from "../controllers/authController"

const router = Router()

router.post('/register', register);
router.post('/login', login);
router.post('/refresh',refresh);
router.post('/logout' , logout);


export default routerPS D:\Brototype\week 23\Efficacy> git add .
warning: in the working copy of 'backend/.env', CRLF will be replaced by LF the next time Git touches it