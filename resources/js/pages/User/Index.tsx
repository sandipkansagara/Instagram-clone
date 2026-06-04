import ProfileCard from '@/modules/user/components/ProfileCard';
import useUsers from '@/modules/user/hooks/useUsers';
import AppLayout from '@/layouts/app-layout';
import { UserList } from '@/modules/user/components/UserList';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ApiPaginatedResponse } from '@/core/types/api';
import { UserApi } from '@/modules/user/types';

export interface Props {
    users: ApiPaginatedResponse<UserApi>;
}

const Index = ({ users: initialUsers }: Props) => {
    const { data : {flattened: users}, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useUsers(initialUsers);

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
                        <ErrorBoundary>
                            <UserList users={users} />
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
