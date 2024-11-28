import { Router, Request, Response } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SignInSchema, SignupSchema } from "../../types";
import client from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";
import {hash, compare} from '../../scrypt'

export const router = Router()

router.post("/signup", async (req, res) => {
    // check the user
    const parsedData = SignupSchema.safeParse(req.body)

    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }

    const hashedPassword = await hash(parsedData.data.password)

    try {
         const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin" ? "Admin" : "User",
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        console.log("erroer thrown")
        res.status(400).json({message: "User already exists"})
    }
})

router.post("/signin", async (req, res) => {
    const parsedData = SignInSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(403).json({message: "Data is not valid"})
        return
    }

    try {
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        })
        
        if (!user) {
            res.status(403).json({message: "User not found"})
            return
        }
        const isValid = await compare(parsedData.data.password, user.password)

        if (!isValid) {
            res.status(403).json({message: "Invalid password"})
            return
        }

        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, JWT_PASSWORD);

        res.json({
            token
        })
    } catch(e) {
        res.status(400).json({message: "Internal server error"})
    }
})

router.get("/elements", async(req, res) => {
    const elements = await client.element.findMany()

    res.json({
        elements: elements.map(element => ({
            id: element.id,
            imageUrl: element.imageUrl,
            static: element.static,
            width: element.width,
            height: element.height
        }))
    })
})

router.get("/avatars", async(req, res) => {
    const avatars = await client.avatar.findMany()
    res.json({
        avatars: avatars.map(avatar => ({
            id: avatar.id,
            name: avatar.name,
            imageUrl: avatar.imageUrl
        }))
    })
})

router.use("/users", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);