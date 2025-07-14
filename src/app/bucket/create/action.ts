"use server";
import { join } from "node:path";
import { existsSync, readdirSync, statSync } from "node:fs"
import prisma from "@/lib/prisma";
import { ActionRes } from "@/type";

import mime from "mime";
import { imageSizeFromFile } from 'image-size/fromFile';

export const feedBucket = async (bucketId: number, source: string, sourceLength: number) => {
    const files = readdirSync(source);
    let count = 0;

    files.sort();

    for (const file of files) {
        var path = join(source, file);
        var stat = statSync(path);

        if (stat.isFile()) {
            const mimeType = mime.getType(file);

            if (!mimeType || !mimeType.startsWith('image')) {
                continue;
            }

            try {
                const size = await imageSizeFromFile(path);

                if (size.orientation && [5, 6, 7, 8].includes(size.orientation)) {
                    const temp = size.width;
                    size.width = size.height;
                    size.height = temp;
                }

                count += 1;
                await prisma.image.create({
                    data: {
                        bucketId,
                        width: size.width,
                        height: size.height,
                        hash: encodeURIComponent(path.substring(sourceLength)),
                    }
                });
            } catch (_) { }
        } else if (stat.isDirectory()) {
            await feedBucket(bucketId, path, sourceLength)
        }
    }

    await prisma.bucket.update({
        where: {
            id: bucketId
        },
        data: {
            total: {
                increment: count
            }
        }
    })
}

export const createBucket = async (name: string, source: string): Promise<ActionRes> => {
    name = name.trim();

    // Vérification des conditions
    if (name.length === 0) {
        return {
            ok: false,
            error: "Nom vide"
        }
    }

    if (!existsSync(source)) {
        return {
            ok: false,
            error: "Le chemin de la source n'existe pas"
        }
    }

    // Création de la sélection
    try {
        const res = await prisma.bucket.create({
            data: {
                name, source
            }
        });

        await feedBucket(res.id, source, source.length);

        return {
            ok: true,
            data: res.id
        }
    } catch (err) {
        return {
            ok: false,
            error: String(err)
        }
    }
}