import archiver from 'archiver';
import fs from 'fs';
import { basename, join } from 'path';
import { NextRequest, NextResponse } from 'next/server'; // Importe NextResponse pour les Route Handlers
import prisma from '@/lib/prisma';

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: any) {
    const { bucketId } = await params;

    let bucket;

    try {
        bucket = await prisma.bucket.findUnique({
            where: {
                id: parseInt(bucketId)
            }
        });
    } catch (err) {
        return new Response('DB error', { status: 500 });
    }

    if (!bucket) {
        return new Response('Bucked id not found.', { status: 404 });
    }

    const images = await prisma.image.findMany({
        where: {
            bucketId: bucket.id,
            selected: true
        }
    });

    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    const archiveName = `${encodeURIComponent(bucket.name)}.zip`;

    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', `attachment; filename="${archiveName}"`);

    const stream = new ReadableStream({
        start(controller) {
            archive.on('data', (chunk) => controller.enqueue(chunk));
            archive.on('end', () => controller.close());
            archive.on('error', (err) => controller.error(err));

            // Définissez le chemin du dossier public
            const paths = images.map((img, index) => {
                return {
                    path: join(bucket.source, decodeURIComponent(img.hash)),
                    name: String(index) + '-' + Math.round(Math.random() * 1000) + '-' + basename(decodeURIComponent(img.hash))
                }
            });

            paths.forEach(file => {
                if (fs.existsSync(file.path)) {
                    archive.file(file.path, { name: file.name });
                } else {
                    console.warn(`Fichier non trouvé: ${file.path}. Il ne sera pas ajouté au zip.`);
                }
            });

            archive.finalize();
        },
    });

    return new NextResponse(stream, { headers });
}