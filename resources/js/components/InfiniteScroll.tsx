import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
interface Props {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    children: React.ReactNode;
}

const InfiniteScroll = ({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    children,
}: Props) => {
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div>
            {children}
            <div ref={ref} className="mt-4 flex justify-center">
                {isFetchingNextPage ? (
                    <p className="text-gray-500">Loading more...</p>
                ) : hasNextPage ? (
                    <p className="text-gray-500">Scroll for more...</p>
                ) : (
                    <p className="text-gray-500">No more notifications.</p>
                )}
            </div>
        </div>
    );
};

export default InfiniteScroll;
