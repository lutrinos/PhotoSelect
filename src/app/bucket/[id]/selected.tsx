import { Image } from "@/type";
import { ScrollArea } from "@mantine/core";

export default function SelectedList({ selected }: { selected: Image[] }) {
    return (
        <ScrollArea h="100%">
            {
                selected.map((img: Image) => {
                    return (
                        <img
                            className='rounded-md p-1'
                            key={img.id}
                            src={`/api/image/${img.bucketId}/${img.hash}`}
                            width="100%"
                            height="auto"
                        />
                    );
                })
            }
        </ScrollArea>
    );
}