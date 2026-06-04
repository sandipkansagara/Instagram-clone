export type NotificationApi = {
    id: number | string;
    message: string | null;
    url: string | null;
    actor_name: string | null;
    created_at: string;
}

export type Notification = {
    id: number | string;
    message: string | null;
    url: string | null;
    actorName: string | null;
    createdAt: string;
};
