# TanStack Query (React Query) Guidelines
- Use TanStack Query for all server-state caching and synchronization.
- Prefer `useQuery` for fetching data.
- Prefer `useMutation` for data modifications.
- Ensure mutations invalidate relevant queries to keep UI in sync.
- Structure queries based on Laravel backend API endpoints.
