import { usePage } from '@inertiajs/react';
import { useEchoNotification } from '@laravel/echo-react';
import { useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@/pages/Notifications/Index';

interface Page {
    data: Notification[];
    next_cursor: string
}

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const { auth } = usePage().props;
    const queryClient = useQueryClient();

    useEchoNotification<Notification>(
        `App.Models.User.${auth.user.id}`,
        (newNotification) => {
            queryClient.setQueryData(['notifications'], (oldData: any) => {
                if (!oldData) {
                    return { pages: [{ data: [newNotification], next_cursor: null }]};
                }

                const notificationExists = oldData.pages.some(
                    (page: Page) => page.data.some((n: Notification) => n.id === newNotification.id),
                );

                if (notificationExists) return oldData;

                // Add the new notification to the beginning of the first page, rest of the pages remain unchanged
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: Page, index: number) => ({
                        ...page,
                        data: index === 0 ? [newNotification, ...page.data] : page.data,
                    })),
                }


            });
        },
        'App.Notifications.ActivityNotification',
    );

    return <>{children}</>;
};
export default NotificationProvider;
