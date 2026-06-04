import ProfileCard from '@/modules/user/components/ProfileCard';
import type { User } from '@/modules/user/types';


export const UserList = ({ users }: { users: User[] }) => {
    return (
        <div>
            {users.map((user) => (
                <ProfileCard key={user.id} user={user} />
            ))}
        </div>
    );
};
