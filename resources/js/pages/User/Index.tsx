import ProfileCard from '@/components/User/ProfileCard';
import useUsers from '@/hooks/Follow/useUsers';
import AppLayout from '@/layouts/app-layout';

export interface User {
    id: number;
    name: string;
    isFollowing: boolean;
    profile: {
        username: string;
        avatar: string;
        bio: string;
        following_count: number;
        followers_count: number;
    };
}

export interface UserData {
    data: User[];
    next_cursor: string | null;
    prev_cursor: string | null;
}

export interface Props {
    users: UserData;
}

const Index = ({ users }: Props) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useUsers(users);

    const flattenedUsers =
        data?.pages.flatMap((page) => page.data) || ([] as User[]);
    return (
        <AppLayout>
            <div className="min-h-screen bg-background p-8">
                <div className="mx-auto max-w-6xl">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Suggested for you
                        </h1>
                        <p className="text-muted-foreground">
                            Follow people you might know.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {flattenedUsers.map((user, i) => (
                            <ProfileCard key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
