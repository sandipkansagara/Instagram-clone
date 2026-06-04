import Media from '@/modules/post/components/Media';
import type { Media as MediaType } from "@/modules/post/types";


const MediaList = ({ mediaList }: { mediaList: MediaType[] }) => {
    const getGridCols = (mediaCount: number) => {
        if (mediaCount === 1) return 'grid-cols-1';
        if (mediaCount === 2) return 'grid-cols-2';
        if (mediaCount === 3) return 'grid-cols-3';
        return 'grid-cols-2'; // For 4+, keep 2x2 or adjust as needed
    };
    return (
        <div className={`grid ${getGridCols(mediaList.length)} gap-1`}>
            {mediaList.map((media: MediaType, index: number) => (
                <Media
                    key={media.id}
                    media={media}
                    index={index}
                    mediaLength={mediaList.length}
                />
            ))}
        </div>
    );
};

export default MediaList;
