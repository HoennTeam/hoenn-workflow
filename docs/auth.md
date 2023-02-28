# Auth

## Admin User Creation
Admin user is created alongside with organization instance on the first launch.
When the instance is created, administrator account credentials are returned, including `username` and one-time `password`.
Administrator then can use those credentials to sign in.

## First Sign In with One-Time Password
When user account is created (including administrator account), the one-time password is returned.
When user tries to sign in with one-time password, system validates credentials and returns `303 Use Other` status, indicating that the user must change their one-time password.

## Changing One-Time Password
User can change their one-time password to a permanent one. User can perform this action only for one-time password, permanent password can be changed only when user is signed in.

## Sign In
When user changed their one-time password to a permanent one, they can use it to sign in.
System establishes a session with the user and saves `sessionId` on the client for future authentication.

## Authentication
Client passes `sessionId` in `Authorization` header with `Bearer` scheme.


