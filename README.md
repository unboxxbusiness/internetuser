# Fresh Next.js Project

This is a new Next.js project created in Firebase Studio.

## Granting Admin Access

The application has role-based security. To access the admin dashboard, a user must have an `admin` role. By default, new users have a `user` role.

To grant a user admin privileges, you must set a custom claim on their Firebase Authentication account. A script is provided to make this easy.

### Prerequisites

1.  The user must have already signed up for an account in the application.
2.  You must have your Firebase Admin SDK credentials in a `.env.local` file at the root of the project.
3.  You must have run `npm install` to install all necessary packages.

### How to Run the Script

Use the following command in your terminal, replacing `user@example.com` with the email of the user you want to make an admin:

```bash
node set-admin-claim.js user@example.com
```

The script will find the user by their email and set the `role: 'admin'` custom claim. The user will have admin access the next time they log in.
