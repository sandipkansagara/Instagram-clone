import NotificationProvider from '@/context/NotificationProvider';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <NotificationProvider>{children}</NotificationProvider>
    </AppLayoutTemplate>
);
