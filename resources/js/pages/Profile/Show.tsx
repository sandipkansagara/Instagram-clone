import ProfileCard from '@/modules/user/components/ProfileCard';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';

export default function Show({ profile }: { profile: any }) {
    const follow = (userId: number) => {
        // Implement follow functionality here
        console.log(`Follow user with ID: ${userId}`);
        router.post(`/users/${userId}/follow`);
    };
    return (
        <AppLayout>
            <ProfileCard user={profile} />
        </AppLayout>
    );
}
