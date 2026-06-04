import AppLayout from '@/layouts/app-layout';
import ProfileCard from '@/modules/user/components/ProfileCard';

export default function Show({ profile }: { profile: any }) {
    return (
        <AppLayout>
            <ProfileCard user={profile} />
        </AppLayout>
    );
}
