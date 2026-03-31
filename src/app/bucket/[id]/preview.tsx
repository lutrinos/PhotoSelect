import { Image } from "@/type";
import { Box } from "@mantine/core";

import InnerImageZoom from "react-inner-image-zoom";

import 'react-inner-image-zoom/lib/styles.min.css';
import './preview.css';

export default function ({ image }: { image: Image }) {
    return (
        <Box className="flex justify-center items-center grow overflow-hidden mb-4 bg-red-200">

            <InnerImageZoom
                src={`/api/image/${image.bucketId}/${image.hash}`}
                hasSpacer={true}
                //className="max-h-full max-w-full"
                //width={100}
                //height={100}
                //className="w-full h-full bg-green-100"
                imgAttributes={{
                    width: 'auto',
                    height: '100%',
                    style: {
                        //width: '',
                        //height: '100%',
                        //maxWidth: '100%',
                        //maxHeight: '100%',
                        //objectFit: 'contain',
                        //background: 'red'
                        maxHeight: '100%'
                    }
                }}
            />
        </Box>
    );
};