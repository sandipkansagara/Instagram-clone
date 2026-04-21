# Project Context

## Overview

This repository is an Instagram-like social app built with Laravel 12, Inertia.js v2, React 19, TypeScript, Tailwind CSS v4, Fortify authentication, Reverb/Echo for realtime features, and Wayfinder for typed frontend route helpers.

The app is served locally through Laravel Herd from the `instagram-clone.test` domain. It uses the Laravel + Inertia React pattern rather than a separate API-first SPA.

## Current Product Shape

Core user-facing features currently present in the codebase:

- Authentication with Laravel Fortify
- Post creation and post detail pages
- Feed page
- Likes
- Comments
- Notifications
- User discovery
- User profiles
- Follow / unfollow
- Realtime-related packages and hooks are present in the stack

## Backend Structure

Important backend conventions visible in this repo:

- Domain-oriented application code under `app/Domains/...`
- HTTP controllers under `app/Http/Controllers`
- Jobs under `app/Jobs`
- Laravel 12 streamlined app structure
- Routes primarily defined in `routes/web.php`, `routes/settings.php`, and `routes/channels.php`

Current architecture direction:

- Controllers are thin transport layers
- Use-case logic lives in `app/Domains/<Feature>/Actions`
- Eloquent models stay in `app/Models`
- Jobs, notifications, listeners, and cache helpers stay as framework / infrastructure code
- Prefer explicit action names like `CreatePost`, `LikePost`, `AddComment`, `FollowUser`, `GetFeed`
- Avoid generic business-layer names like `PostService`, `ProfileService`, or `FollowService`

Examples:

- Feed read action: `app/Domains/Feed/Actions/GetFeed.php`
- Post creation action: `app/Domains/Post/Actions/CreatePost.php`
- Comment actions: `app/Domains/Post/Actions/AddComment.php`, `app/Domains/Post/Actions/DeleteComment.php`
- Follow actions: `app/Domains/User/Actions/FollowUser.php`, `app/Domains/User/Actions/UnfollowUser.php`
- Post fanout job: `app/Jobs/FanoutPostJob.php`

## Frontend Structure

Frontend conventions visible in this repo:

- Inertia pages under `resources/js/pages`
- Reusable UI and feature components under `resources/js/components`
- App layouts under `resources/js/layouts`
- Feature hooks under `resources/js/hooks`
- Wayfinder-generated controller and route helpers under `resources/js/actions` and `resources/js/routes`

Important note:

- Frontend code should prefer Wayfinder helpers instead of hardcoded URLs when calling backend routes

## Main Routes

Authenticated app routes currently include:

- `/feed`
- `/posts`
- `/posts/{post}`
- `/notifications`
- `/users`
- `/{username}` for profile pages

There are also actions for:

- creating posts
- liking / unliking posts
- creating / deleting comments
- marking notifications as read
- following / unfollowing users

## Project Rules To Preserve

When working in this repository, keep these constraints in mind:

- Follow existing Laravel and Inertia conventions already used in the repo
- Reuse existing components and patterns before introducing new ones
- Keep controllers short and move workflow logic into domain actions
- Keep database state as the source of truth; use Redis/cache as an optimization, not correctness-critical state
- Keep viewer-specific state out of shared cache entries
- Use Pest for tests
- Every code change should be covered by programmatic testing
- Run the minimum relevant tests with `php artisan test --compact`
- If PHP files change, run `vendor/bin/pint --dirty --format agent`
- Use Wayfinder for frontend-to-backend route integration
- Do not add dependencies or create new top-level folders without approval

## Useful Commands

- `php artisan test --compact`
- `vendor/bin/pint --dirty --format agent`
- `npm run lint`
- `npm run types:check`
- `npm run build`

## Naming Conventions

Preferred action naming:

- Reads: `GetFeed`, `GetPost`, `GetProfileByUsername`, `ListPosts`, `ListNotifications`
- Writes: `CreatePost`, `LikePost`, `UnlikePost`, `AddComment`, `DeleteComment`, `FollowUser`, `UnfollowUser`, `MarkNotificationAsRead`

Preferred implementation style:

- request validation in Form Requests
- business workflow in action classes
- persistence and relationships in Eloquent models
- async work in jobs
- delivery concerns in notifications

Avoid introducing generic `*Service` classes unless there is a clearly reusable collaborator that is not itself a use-case.

## Recommended Use In ChatGPT Projects

If this file is uploaded into a ChatGPT Project, treat it as the shared high-level source of truth for:

- framework and library stack
- app architecture
- key routes and features
- repo conventions
- testing and formatting expectations

For the best shared context, upload both:

- `AGENTS.md`
- `PROJECT_CONTEXT.md`

Keep this file short and update it whenever the app gains a major feature, architectural change, or workflow change.
