"use server";

import prisma from "@/lib/prisma";
import { ActionRes } from "@/type";

export const getBuckets = async (): Promise<ActionRes> => {
    try {
        const buckets = await prisma.bucket.findMany();
        return {
            ok: true,
            data: buckets
        }
    } catch (_) { }
    return {
        ok: false
    }
}