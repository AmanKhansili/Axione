# Axione Admin Panel - Supabase Auth Setup

## 1. Create the admin user

In Supabase Dashboard:

Authentication -> Users -> Add user

Create the admin email/password that will be used on `/admin/login`.

If you want the display name to show in the dashboard, add user metadata such as:

```json
{
  "name": "Admin",
  "role": "admin"
}
```

## 2. Important database permissions

Run `supabase-admin-policies.sql` in Supabase SQL Editor.

The frontend uses the public anon key only. After login, protected admin requests use the Supabase Auth access token.

## 3. Replace files

Copy the contents of:

`src/app/admin/`

into the existing project's:

`src/app/admin/`

and replace:

`src/app/services/api.ts`

with the included file.

## 4. Test

Run:

```bash
ng serve
```

Then open:

`/admin/login`

Test:

- Login
- Dashboard counts
- Blogs
- Add/Edit/Delete blog
- Services
- Contacts
- Newsletter
- Logout
- Direct access to `/admin/dashboard` without login

## Security note

Do not put a Supabase service_role/secret key in Angular. The included code uses the public anon key and the authenticated user's access token.
