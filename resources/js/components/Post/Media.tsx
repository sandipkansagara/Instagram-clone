import { Media as MediaType } from "./types";

interface Props {
    media: MediaType;
    index: number;
    mediaLength: number;
}

const Media = ({ media, index, mediaLength }: Props) => {
    return (
        <div
            key={media.id}
            className={`relative overflow-hidden bg-gray-100 dark:bg-gray-900 ${mediaLength === 3 && index === 0 ? 'col-span-2 row-span-2' : ''} ${mediaLength === 1 ? 'max-h-96' : 'aspect-square'}`}
        >
            {media.type.startsWith('image/') ? (
                <img loading="lazy"
                    src={media.url}
                    alt="Post media"
                    className="h-full w-full object-cover"
                />
            ) : (
                <video
                    src={media.url}
                    controls
                    className="h-full w-full object-cover"
                />
            )}
        </div>
    );
}
export default Media
