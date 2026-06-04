import { useNotification } from '@/modules/notification/hooks/useNotification';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ApiPaginatedResponse } from '@/core/types/api';
import { Notification, NotificationApi } from '@/modules/notification/types';

type Props = {
    notifications: ApiPaginatedResponse<NotificationApi>;
};

const Index = ({ notifications: notificationsInitial }: Props) => {
    const {
        data: { flattened: notifications },
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useNotification(notificationsInitial);
    const { ref, inView } = useInView();


    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    return (
        <AppLayout>
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Notifications</h1>
                {notifications.length === 0 ? (
                    <p className="text-gray-500">You have no notifications.</p>
                ) : (
                    <>
                        <ul className="space-y-4">
                            {notifications.map((notification: Notification) => (
                                <li
                                    key={notification.id}
                                    className="rounded-lg bg-white shadow-sm transition hover:bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:hover:bg-gray-700"
                                >
                                    {/* Wrap the content in a Link to the specific post/profile */}
                                    <Link
                                        href={notification.url || '#'}
                                        className="block p-4"
                                    >
                                        <p className="text-sm text-gray-700 dark:text-gray-200">
                                            {/* Actor Name in Bold */}
                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                {notification.actorName}
                                            </span>{' '}
                                            {notification.message}
                                        </p>

                                        <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                                            {notification.createdAt}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div ref={ref} className="mt-4 flex justify-center">
                            {isFetchingNextPage ? (
                                <p className="text-gray-500">Loading more...</p>
                            ) : hasNextPage ? (
                                <p className="text-gray-500">
                                    Scroll for more...
                                </p>
                            ) : (
                                <p className="text-gray-500">
                                    No more notifications.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
};

export default Index;
