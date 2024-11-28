import {z} from 'zod';

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
    type: z.enum(['user', 'admin']),
})

export const SignInSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
})

export const UpdateMetadataSchema = z.object({
    avatarId: z.string(),
})

export const CreateSpaceSchema = z.object({
    name: z.string(),
    dimesions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string(),
})

export const AddElementSchema = z.object({
    spaceId: z.string(),
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
})

export const DeleteElementSchema = z.object({
    id: z.string(),
})

// admin
export const CreateElementAdminSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean(),
})

export const UpdateElementAdminSchema = z.object({
    imageUrl: z.string(),
})

export const CreateAvatarAdminSchema = z.object({
    imageUrl: z.string(),
    name: z.string(),
})

export const CreateMapSchema = z.object({
    name: z.string(),
    thumbnail: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number(),
    }))
})