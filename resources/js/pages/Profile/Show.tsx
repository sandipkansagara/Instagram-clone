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
            <div>
                <h1>{profile.username}</h1>
                <p>{profile.bio}</p>
                {/* <img src={profile.avatar} alt={`${profile.username}'s avatar`} />
            <p>Followers: {profile.followers_count}</p>
            <p>Following: {profile.following_count}</p>
            <p>Posts: {profile.posts_count}</p> */}
                <button onClick={() => follow(profile.user.id)}>Follow</button>
            </div>
        </AppLayout>
    );
}
