import express from "express";
import authRouter from "./authRoute"
import companyRouter from "./companyRoute"
import userRouter from "./userRoute"
import productRouter from "./productRoute"
import billRouter from "./billRoute"
import path from "path";

const router = express.Router();

router.use("/", authRouter);
router.use("/", companyRouter);
router.use("/", userRouter);
router.use("/" , productRouter)
router.use("/" , billRouter)
router.use("/upload", express.static(path.join(process.cwd(), "upload"))); 

export { router };
