import { Image } from "@/type";
import { Box } from "@mantine/core";

import InnerImageZoom from "react-inner-image-zoom";
import 'react-inner-image-zoom/lib/styles.min.css';

export default function ({ image }: { image: Image }) {
    return (
        <Box className="flex justify-center items-center grow overflow-hidden mb-4">

            <InnerImageZoom
                src={`/api/image/${image.bucketId}/${image.hash}`}
                className="max-h-full max-w-full"
                imgAttributes={{
                    style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }
                }}
            />
        </Box>
    );
};