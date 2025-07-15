"use client";

import { Bucket, Image } from '@/type';
import { Carousel } from '@mantine/carousel';
import { Image as MantineImage } from '@mantine/core';
import { EmblaCarouselType } from 'embla-carousel';
import { useEffect, useState } from 'react';

const IMAGE_OFFSET = 4;

export const ImagesCarousel = ({ images, height = 100, index = 0, onClick }: { images: Image[], height?: number, index?: number, onClick: (index: number, image: Image) => void }) => {
    const [slide, setSlide] = useState(0);
    const [api, setApi] = useState<EmblaCarouselType | null>(null);
    const [limits, setLimits] = useState([0, 0]);

    useEffect(() => {
        if (api) {
            if (index === slide - 1) {
                api.scrollPrev();
            } else if (index === slide + 1) {
                api.scrollNext();
            }
        }
    }, [api, slide, index]);

    useEffect(() => {
        if (api && Math.abs(index - slide) > 1 && images.length > index) {
            api.scrollTo(index, true);
        }
    }, [api, images, index]);

    useEffect(() => {
        if (api) {
            const arr = api.slidesInView();
            setLimits([arr[0] - IMAGE_OFFSET, arr[1] + IMAGE_OFFSET]);
        }
    }, [api, slide]);


    return (
        <Carousel
            w="100%"
            height={height}
            slideSize="auto"
            slideGap="xs"
            withControls={false}
            withIndicators={false}
            withKeyboardEvents={false}
            getEmblaApi={setApi}
            onSlideChange={setSlide}
            emblaOptions={{
                align: 'start'
            }}

        >
            {
                images.map((img: Image, i: number) => (
                    <Carousel.Slide
                        key={img.id}
                        p={4}
                        onClick={() => onClick(i, img)}
                        className={`rounded-md border-2 transition-all ${img.selected ? 'border-green-500' : (index === i ? 'border-slate-500' : 'border-transparent')}`}
                    >
                        <MantineImage
                            onLoad={(evt) => {
                                if (evt.target) {
                                    (evt.target as HTMLDivElement).style.width = "auto";
                                }
                            }}
                            src={`/api/image/${img.bucketId}/${img.hash}`}
                            alt={img.hash}
                            h={height - 12}
                            w={(height - 12) * img.width / img.height}
                            fit="contain"
                            radius="md"
                            loading={(i >= limits[0] && i <= limits[1]) ? 'eager' : 'lazy'}
                            className="bg-amber-100"
                        />
                    </Carousel.Slide>
                ))
            }
        </Carousel >
    );
};