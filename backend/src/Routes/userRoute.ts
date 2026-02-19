import express from "express"
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controllers"

const router = express.Router()

router.get("/get/users" , getAllUsers)
router.get("/users/:id", getUserById); 
router.put("/update/user/:id" , updateUser)
router.delete("/delete/user/:id" , deleteUser)

export default router