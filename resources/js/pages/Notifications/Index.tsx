import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { useEcho, useEchoPublic } from '@laravel/echo-react';
import { useState } from 'react';

interface Notification {
    id: number | string;
    message: string | null;
    created_at: string;
}

interface NotificationProps {
    notifications: {
        data: Notification[];
    };
}
const Index = ({ notifications }: NotificationProps) => {
    const { auth } = usePage().props;
    const [notificationsData, setNotificationsData] = useState<Notification[]>(notifications.data);

    useEcho<{ notification: Notification }>('user.' + auth.user.id, 'NotificationCreated', (e) => {
        console.log('New notification received:' , e.notification);
        setNotificationsData((prev) => [e.notification, ...prev]);
    });

    return (
        <AppLayout>
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Notifications</h1>
                {notificationsData.length === 0 ? (
                    <p className="text-gray-500">You have no notifications.</p>
                ) : (
                    <ul className="space-y-4">
                        {notificationsData.map(
                            (notification: Notification) => (
                                <li
                                    key={notification.id}
                                    className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 dark:shadow-lg"
                                >
                                    <p className="text-sm text-gray-700 dark:text-gray-200">
                                        {notification.message}
                                    </p>
                                    <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(
                                            notification.created_at,
                                        ).toLocaleString()}
                                    </span>
                                </li>
                            ),
                        )}
                    </ul>
                )}
            </div>
        </AppLayout>
    );
};

export default Index;
