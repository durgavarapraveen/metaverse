import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import { CreateAvatarAdminSchema, CreateElementAdminSchema, CreateMapSchema, UpdateElementAdminSchema } from "../../types";
import client from "@repo/db/client";

export const adminRouter = Router()

adminRouter.post('/element', adminMiddleware ,async(req, res) => {
    const parseData = CreateElementAdminSchema.safeParse(req.body)

    if(!parseData.success) {
        res.status(400).json({
            message: "The data is not valid"
        })
        return;
    }

    // create element

    await client.element.create({
        data: {
            width: parseData.data.width,
            height: parseData.data.height,
            imageUrl: parseData.data.imageUrl,
            static: parseData.data.static,
        }
    })

    res.status(200).json({
        message: "Element created successfully"
    })

})

adminRouter.put('/element/:elementId', adminMiddleware ,async(req, res) => {
    const parseData = UpdateElementAdminSchema.safeParse(req.body)

    if(!parseData.success) {
        res.status(400).json({
            message: "The data is not valid"
        })
        return;
    }

    // update element
    await client.element.update({
        where: {
            id: req.params.elementId
        },
        data: {
            imageUrl: parseData.data.imageUrl,
        }
    })

    res.status(200).json({
        message: "Element updated successfully"
    })
})

adminRouter.post('/avatar', adminMiddleware , async (req, res) => {
    const parseData = CreateAvatarAdminSchema.safeParse(req.body)

    if(!parseData.success) {
        res.status(400).json({
            message: "The data is not valid"
        })
        return;
    }

    const avatar = await client.avatar.create({
        data: {
            imageUrl: parseData.data.imageUrl,
            name: parseData.data.name,
        }
    })

    res.status(200).json({
        message: "Avatar created successfully",
        id: avatar.id
    })

})

adminRouter.get('/map', adminMiddleware , async(req, res) => {
    const parseData = CreateMapSchema.safeParse(req.body)

    if(!parseData.success) {
        res.status(400).json({
            message: "The data is not valid"
        })
        return;
    }

    const map = await client.map.create({
        data: {
            thumbnail: parseData.data.thumbnail,
            name: parseData.data.name,
            width: parseInt(parseData.data.dimensions.split("x")[0]),
            height: parseInt(parseData.data.dimensions.split("x")[1]),

            mapElements: {
                create: parseData.data.defaultElements.map(element => ({
                        elementId: element.elementId,
                        x: element.x,
                        y: element.y
                    }))
                
            }
        }
    })

    res.status(200).json({
        message: "Map created successfully",
        id: map.id
    })

})