import { Router } from "express";
import { UpdateMetadataSchema } from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";

export const userRouter = Router()

userRouter.post("/metadata", userMiddleware ,async(req, res) => {
    const parseData = UpdateMetadataSchema.safeParse(req.body)

    if(!parseData.success) {
        res.status(400).json({
            message: "The data is not valid"
        })
        return;
    }

    await client.user.update({
        where: {
            id: req.userId
        },
        data: {
            avatarId: parseData.data.avatarId,
        }
    }).then(() => {
        res.status(200).json({
            message: "Metadata updated successfully"
        })
    }).catch((error) => {
        res.status(400).json({
            message: "Avatar not found"
        })
    })


})


userRouter.get("/metadata/bulk", async(req, res) => {
    const ids = req.query.ids as string;
    
    console.log(ids)

    if(!ids) {
        res.status(400).json({
            message: "Ids are required"
        })
        return;
    }

    const userIds = ids.split(",").map(id => id.trim());

    console.log(userIds)
    
    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            id: true,
            avatar: true
        }
    })

    res.json({
        avatars : metadata?.map(m => ({
            id: m.id,
            avatar: m.avatar?.imageUrl
        }))
    })

})