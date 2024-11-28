import { Router } from "express";
import { AddElementSchema, CreateElementAdminSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types";
import client from "@repo/db/client";
import { userMiddleware } from "../../middleware/user";

export const spaceRouter = Router()

spaceRouter.post('/', userMiddleware ,async(req, res) => {
    const parseData = CreateSpaceSchema.safeParse(req.body)
    console.log(req.body)
    console.log(parseData)
    if(!parseData.success) {
        res.status(400).json({
            message: "The data is not valid"
        })
        return;
    }

    if(!parseData.data.mapId) {
        const space = await client.space.create({
            data: {
                name: parseData.data.name,
                width: parseInt(parseData.data.dimesions.split("x")[0]),
                height: parseInt(parseData.data.dimesions.split("x")[1]),
                creatorId: req.userId as string
            }
        })
        res.status(200).json({
            message: "Space created successfully",
            spaceId: space.id
        })
        return;
    }

    const map = await client.map.findUnique({
        where: {
            id: parseData.data.mapId
        }, select: {
            mapElements: true,
            width: true,
            height: true

        }
    })

    if(!map) {
        res.status(400).json({
            message: "Map not found"
        })
        return;
    }

    let space = await client.$transaction(
        async() => {
            const space = await client.space.create({
                data: {
                    name: parseData.data.name,
                    width: map.width,
                    height: map.height,
                    creatorId: req.userId as string,
                }
            });
    
            await client.spaceElements.createMany({
                data: map.mapElements.map(element => ({
                    elementId: element.elementId,
                    x: element.x!,
                    y: element.y!,
                    spaceId: space.id
                }))
            });
    
            return space;
        }
    )

    res.json({
        message: "Space created successfully",
        spaceId: space.id
    })

})

spaceRouter.delete('/:spaceId', userMiddleware ,async(req, res) => {
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        },select: {
            creatorId: true
        }
    })

    if(!space) {
        res.status(400).json({
            message: "Space not found"
        })
        return;
    }

    if(space?.creatorId !== req.userId) {
        res.status(403).json({
            message: "You are not authorized to delete this space"
        })
        return;
    }

    await client.space.delete({
        where: {
            id: req.params.spaceId
        }
    }).then(() => {
        res.status(200).json({
            message: "Space deleted successfully"
        })
    }
    ).catch((error) => {
        res.status(500).json({
            message: "Internal server error"
        })
    })

})

spaceRouter.get('/all',userMiddleware,async (req, res) => {
    const spaces = await client.space.findMany({
        where: {
            creatorId: req.userId
        }
    })

    res.json({
        spaces : spaces.map(space => ({
            id: space.id,
            name: space.name,
            thumbnail: space.thumbnail,
            dimensions: `${space.width}x${space.height}`
        }))
    })
})



spaceRouter.post('/element', userMiddleware , async(req, res) => {
    const element = AddElementSchema.safeParse(req.body)

    if(!element.success) {
        res.status(400).json({
            message: "The data is not valid"
        })
        return;
    }

    const space = await client.space.findUnique({
        where: {
            id: req.body.spaceId,
            creatorId: req.userId!
        }, select: {
            width: true,
            height: true
        }
    })

    if(!space) {
        res.status(400).json({
            message: "Space not found"
        })
        return;
    }

    await client.spaceElements.create({
        data: {
            elementId: element.data.elementId,
            x: element.data.x,
            y: element.data.y,
            spaceId: req.body.spaceId
        }
    }).then(() => {
        res.status(200).json({
            message: "Element added successfully"
        })
    }
    ).catch(() => {
        res.status(500).json({
            message: "Internal server error"
        })
    })

})

spaceRouter.delete('/element',userMiddleware, async (req, res) => {
    const parseData = DeleteElementSchema.safeParse(req.body)

    if(!parseData.success) {
        res.status(400).json({
            message: "The data is not valid"
        })
        return;
    }

    const spaceElement = await client.spaceElements.findFirst({
        where: {
            id: parseData.data.id
        },
        include: {
            space: true
        }
    })

    if(!spaceElement) {
        res.status(400).json({
            message: "Element not found"
        })
        return;
    }

    if(spaceElement.space?.creatorId !== req.userId) {
        res.status(403).json({
            message: "You are not authorized to delete this element"
        })
        return;
    }


    await client.spaceElements.delete({
        where: {
            id: parseData.data.id
        }
    }).then(() => {
        res.status(200).json({
            message: "Element deleted successfully"
        })
    }
    ).catch(() => {
        res.status(500).json({
            message: "Internal server error"
        })
    })


})

spaceRouter.get('/:spaceId', async(req, res) => {
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId
        }, include: {
            elements: {
                include : {
                    element: true
                }
            }

        }
    })

    if(!space) {
        res.status(400).json({
            message: "Space not found"
        })
        return;
    }

    res.json({
        id: space.id,
        dimesions: `${space.width}x${space.height}`,
        elements: space.elements?.map(element => ({
            id: element.id,
            x: element.x,
            y: element.y,
            element: {
                id: element.element.id,
                imageUrl: element.element.imageUrl,
                width: element.element.width,
                height: element.element.height,
                static: element.element.static
            }
        }))
    })

})