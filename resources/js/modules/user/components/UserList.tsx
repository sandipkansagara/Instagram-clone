import ProfileCard from '@/modules/user/components/ProfileCard';
import { User } from '@/modules/user/types';

type Props = {
    users: User[];
};
export const UserList = ({ users }: { users: User[] }) => {
    return (
        <div>
            {users.map((user) => (
                <ProfileCard key={user.id} user={user} />
            ))}
        </div>
    );
};
