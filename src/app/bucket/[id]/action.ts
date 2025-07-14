"use server";
import prisma from "@/lib/prisma";
import { ActionRes } from "@/type";

export const getBucket = async (id: number): Promise<ActionRes> => {
    try {
        const data = await prisma.bucket.findUnique({
            where: {
                id
            }
        });

        return {
            ok: Boolean(data),
            data: data
        };
    } catch (err) {
        return {
            ok: false,
            error: String(err)
        }
    }
}

export const getBucketSelectedImages = async (bucketId: number): Promise<ActionRes> => {
    try {
        const data = await prisma.image.findMany({
            where: {
                bucketId,
                selected: true
            },
            orderBy: {
                id: 'desc'
            }
        });

        return {
            ok: true,
            data: data
        }
    } catch (err) {
        return {
            ok: false,
            error: String(err)
        }
    }
};

export const getBucketImages = async (bucketId: number): Promise<ActionRes> => {
    try {
        const data = await prisma.image.findMany({
            where: {
                bucketId
            },
            orderBy: {
                id: 'asc'
            }
        });

        return {
            ok: true,
            data: data
        }
    } catch (err) {
        return {
            ok: false,
            error: String(err)
        }
    }
};

export const selectImage = async (id: number, select: boolean): Promise<ActionRes> => {
    try {
        const data = await prisma.image.update({
            where: {
                id
            },
            data: {
                selected: select
            }
        });

        await prisma.bucket.update({
            where: {
                id: data.bucketId
            },
            data: {
                count: {
                    increment: select ? 1 : -1
                }
            }
        });

        return {
            ok: true
        };
    } catch (_) {
        return {
            ok: false
        }
    }
};

export const setBucketIndex = async (bucketId: number, index: number): Promise<ActionRes> => {
    try {
        await prisma.bucket.update({
            where: {
                id: bucketId
            },
            data: {
                index
            }
        });

        return {
            ok: true
        }
    } catch (_) { }

    return {
        ok: false
    }
};