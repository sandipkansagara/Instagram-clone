import Post from '@/components/Post/Post';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

interface Media {
    id: number;
    type: string;
    url: string;
}

interface Post {
    id: number;
    caption: string | null;
    media: Media[];
    likes_count?: number;
    liked?: boolean;
}

interface ShowProps {
    post: Post;
}

const Show = ({ post }: ShowProps) => {
    const { auth: { user } } = usePage().props;

    return (
        <AppLayout>
            <Post post={post} user={user} queryKey={["posts"] } commentShow={true} />
        </AppLayout>
    );
};

export default Show;
