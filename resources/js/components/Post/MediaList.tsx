import Media from './Media';

interface Media {
    id: number;
    type: string;
    url: string;
}

const MediaList = ({ mediaList }: { mediaList: Media[] }) => {
    const getGridCols = (mediaCount: number) => {
        if (mediaCount === 1) return 'grid-cols-1';
        if (mediaCount === 2) return 'grid-cols-2';
        return 'grid-cols-2';
    };
    return (
        <div className={`grid ${getGridCols(mediaList.length)} gap-1`}>
            {mediaList.map((media: Media, index: number) => (
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
