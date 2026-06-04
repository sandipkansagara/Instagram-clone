import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, UserCheck } from 'lucide-react';
import useToggleFollow from '@/modules/follow/hooks/useToggleFollow';
import { User } from '@/modules/user/types';

export interface MutationVars{
    userId: number;
    isFollowing: boolean;
}

const ProfileCard = ({ user }: { user: User }) => {
    const { mutate: toggleFollow, isPending } = useToggleFollow();

    return (
        <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <Avatar className="h-16 w-16 border-2 border-background ring-2 ring-primary/5">
                        <AvatarImage
                            src={user.profile?.avatar}
                            alt={user.name}
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <Button
                        variant={user.isFollowing ? 'outline' : 'default'}
                        size="sm"
                        className="h-9 rounded-full px-4 font-semibold"
                        onClick={() => toggleFollow({userId:user.id, isFollowing:user.isFollowing})}
                    >
                        {user.isFollowing ? (
                            <span className="flex items-center gap-1.5">
                                <UserCheck className="h-4 w-4" /> Unfollow
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <UserPlus className="h-4 w-4" /> Follow
                            </span>
                        )}
                    </Button>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex flex-col">
                        <h3 className="text-lg leading-tight font-bold tracking-tight">
                            {user.name}
                        </h3>
                        <span className="text-xs font-medium text-muted-foreground">
                            {user.profile?.username}
                        </span>
                    </div>

                    <p className="line-clamp-2 min-h-10 text-sm leading-snug text-muted-foreground">
                        {user.profile?.bio}
                    </p>
                </div>

                <div className="mt-5 flex gap-4 border-t border-border/40 pt-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold">
                            {user.profile?.followersCount}
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Followers
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold">
                            {user.profile?.followingCount}
                        </span>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Following
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;
