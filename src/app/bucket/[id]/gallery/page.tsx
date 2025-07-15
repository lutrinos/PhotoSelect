"use client";

import { useCallback, useEffect, useState } from 'react';
import { EmblaCarouselType } from 'embla-carousel';
import { Carousel } from '@mantine/carousel';
import { AppShell, Button, Flex, Progress, Title, Text, Image as MantineImage, Center } from '@mantine/core';
import Link from 'next/link';
import { redirect, RedirectType, useParams } from 'next/navigation';
import { Bucket, Image } from '@/type';
import { getBucket, getBucketSelectedImages } from '../action';

export default function () {
    const params = useParams<{ id: string }>();
    const [bucket, setBucket] = useState<Bucket | null | false>(null);

    const [images, setImages] = useState<Image[]>([]);
    const [progress, setProgress] = useState(0);
    const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

    const handleScroll = useCallback(() => {
        if (!embla) {
            return;
        }
        const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
        setProgress(progress * 100);
    }, [embla, setProgress]);

    const updateBucket = async () => {
        try {
            var res = await getBucket(parseInt(params.id));

            if (res.ok) {
                setBucket(res.data);
                return;
            }
        } catch (err) { }
        return redirect('/', RedirectType.replace);
    };

    const updateImages = async () => {
        try {
            var res = await getBucketSelectedImages(parseInt(params.id));

            if (res.ok) {
                return setImages(res.data);
            }
        } catch (err) { }
    };

    useEffect(() => {
        setBucket(null);
        updateBucket();
        updateImages();
    }, [params.id]);

    useEffect(() => {
        if (embla) {
            embla.on('scroll', handleScroll);
            handleScroll();
        }
    }, [embla]);

    if (!bucket) {
        return;
    }

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header>
                <Flex className='h-full' justify="space-between" align="center" gap="xl" p={8}>
                    <Title order={4}>{bucket.name}</Title>
                    <Progress value={progress} w="100%" maw={320} size="sm" mx="auto" />
                    <Button
                        variant="light"
                        component={Link}
                        href={`/bucket/${bucket.id}`}>
                        Retour à la sélection
                    </Button>
                </Flex>
            </AppShell.Header>
            <AppShell.Main>
                <div className='relative overflow-hidden'
                    style={{
                        height: 'calc(100vh - var(--app-shell-header-offset, 0rem) - 2 * var(--app-shell-padding))'
                    }}
                >
                    <Carousel
                        emblaOptions={{ dragFree: true }}
                        slideSize="auto"
                        className='flex justify-center items-center h-full bg-black'
                        getEmblaApi={setEmbla}
                        initialSlide={2}

                    >
                        {
                            images.map((img: Image, i: number) => (
                                <Carousel.Slide
                                    key={img.id}
                                    p={4}
                                    className='flex justify-center items-center bg-black relative'
                                    w="calc(100vw - 2 * var(--app-shell-padding))"
                                    h="calc(100vh - 2 * var(--app-shell-padding) - var(--app-shell-header-offset))"
                                >
                                    <MantineImage
                                        onLoad={(evt) => {
                                            if (evt.target) {
                                                (evt.target as HTMLDivElement).style.width = "auto";
                                            }
                                        }}
                                        src={`/api/image/${img.bucketId}/${img.hash}`}
                                        alt={img.hash}
                                        h="100%"
                                        w="100%"
                                        fit="contain"
                                        loading='lazy'
                                    />
                                </Carousel.Slide>
                            ))
                        }
                    </Carousel>
                    {/*<Center>
                        <Progress value={progress} maw={320} size="sm" mt="xl" mx="auto" />
                    </Center>*/}
                </div>
            </AppShell.Main>
        </AppShell >
    );
}