"use client";

import { AppShell, Text, Center, Flex, Title, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getBucket, getBucketImages, getBucketSelectedImages, selectImage, setBucketIndex } from './action';
import { redirect, RedirectType, useParams } from 'next/navigation';

import { Bucket, Image } from '@/type';
import { Footer } from './footer';
import { ImagesCarousel } from './carousel';
import Preview from './preview';
import SelectedList from './selected';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';


export default function () {
    const params = useParams<{ id: string }>();
    const [bucket, setBucket] = useState<Bucket | null | false>(null);

    const [images, setImages] = useState<Image[]>([]);
    const [selected, setSelected] = useState<Image[]>([]);

    const [index, setIndex] = useState(0);

    const updateBucket = async () => {
        try {
            var res = await getBucket(parseInt(params.id));

            if (res.ok) {
                setBucket(res.data);
                setIndex(res.data.index);
                return;
            }
        } catch (err) { }
        return redirect('/', RedirectType.replace);
    };

    const updateImages = async () => {
        try {
            var res = await getBucketImages(parseInt(params.id));

            if (res.ok) {
                return setImages(res.data);
            }
        } catch (err) { }
    };

    const updateSelected = async () => {
        try {
            var res = await getBucketSelectedImages(parseInt(params.id));

            if (res.ok) {
                return setSelected(res.data);
            }
        } catch (err) { }
    };

    useEffect(() => {
        setBucket(null);
        updateBucket();
        updateImages();
        updateSelected();
    }, [params.id]);

    useEffect(() => {
        if (bucket) {
            setBucketIndex(bucket.id, index);
        }

        setBucket((v) => {
            if (v) {
                v.index = index;
            }
            return v;
        })
    }, [index]);

    useEffect(() => {
        const fn = (e) => {
            if (images.length === 0) return;
            if (e.keyCode === 39) {// Droite
                setIndex((v) => {
                    console.log(v, Math.min(v + 1, images.length - 1));
                    return Math.min(v + 1, images.length - 1);
                });
            } else if (e.keyCode === 37) {// Gauche
                setIndex((v) => Math.max(v - 1, 0))
            }
        };

        document.addEventListener('keydown', fn);

        return () => {
            document.removeEventListener('keydown', fn);
        };
    }, [images]);

    if (!bucket) {
        return;
    }

    return (
        <AppShell
            header={{ height: 60 }}
            footer={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: true, desktop: false } }}
            padding="md"
        >
            <AppShell.Header>
                <Flex className='h-full' justify="space-between" align="center" gap="xl" p={8}>
                    <Title order={4}>{bucket.name}</Title>
                    <Text>{bucket.count} / {bucket.total} sélectionné</Text>
                    <Button
                        variant="light"
                        component={Link}
                        href="/">
                        Accueil
                    </Button>
                </Flex>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Title order={4} className='text-center'>Images sélectionnées</Title>
                <SelectedList selected={selected} />
            </AppShell.Navbar>
            <AppShell.Main>
                <div className='relative flex flex-col w-full' style={{
                    height: 'calc(100vh - var(--app-shell-header-offset, 0rem) - var(--app-shell-footer-offset, 0rem) - 2 * var(--app-shell-padding))'
                }}>
                    {
                        images.length > 0 ? (
                            <Preview image={images[index]} />
                        ) : (
                            <Center className='grow'>
                                Aucune image chargée
                            </Center>
                        )
                    }
                    <ImagesCarousel
                        onClick={(index) => {
                            setIndex(index);
                        }}
                        index={index}
                        height={200}
                        images={images}
                    />
                </div>
            </AppShell.Main>
            <AppShell.Footer p="md">
                <Flex justify="space-between" align="center">
                    {
                        images.length > 0 && (
                            <Text>Image {index + 1} sur {bucket.total}</Text>
                        )
                    }
                    <Footer
                        selected={images.length > 0 && images[index].selected}
                        onPrev={() => setIndex((v) => v - 1)}
                        onNext={() => setIndex((v) => v + 1)}
                        onSelect={async (select: boolean) => {
                            await selectImage(images[index].id, select);
                            images[index].selected = select;
                            notifications.show({
                                message: select ? "Image sélectionnée !" : "Image déselectionnée !"
                            })
                            updateSelected();
                            updateBucket();
                        }}
                        prevDisabled={index <= 0}
                        nextDisabled={index >= images.length - 1}
                    />
                    <Button onClick={() => window.open(`/api/bucket/download/${bucket.id}`, RedirectType.push)} disabled={!bucket}>Télécharger</Button>
                </Flex>
            </AppShell.Footer>
        </AppShell>
    );
}