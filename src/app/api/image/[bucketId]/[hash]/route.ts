//import { PrismaClient } from "@/app/generated/prisma/edge";
import prisma from "@/lib/prisma";
import { createReadStream, existsSync } from "fs";
import { NextRequest } from "next/server";
import { join } from "path";

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: any) {
    const { bucketId, hash } = await params;

    let data;

    try {
        data = await prisma.bucket.findUnique({
            where: {
                id: parseInt(bucketId)
            }
        });
    } catch (err) {
        return new Response('DB error', { status: 500 });
    }

    if (!data) {
        return new Response('Bucked id not found.', { status: 404 });
    }

    let path;

    try {
        path = join(data.source, decodeURIComponent(hash))
    } catch (_) {
        return new Response('Hash malformed', { status: 404 });
    }

    if (!existsSync(path)) {
        return new Response('Path not found', { status: 404 });
    }

    const fileStream = createReadStream(path);

    const webStream = await new Promise<ReadableStream>((resolve, reject) => {
        const readableWebStream = new ReadableStream({
            start(controller) {
                fileStream.on('data', (chunk) => {
                    controller.enqueue(chunk);
                });
                fileStream.on('end', () => {
                    controller.close();
                });
                fileStream.on('error', (err) => {
                    console.error("Error reading file stream:", err);
                    controller.error(err);
                    reject(err);
                });
            },
            cancel() {
                fileStream.destroy();
            }
        });
        resolve(readableWebStream);
    });

    return new Response(webStream);
}