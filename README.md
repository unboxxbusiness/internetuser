# Fresh Next.js Project

This is a new Next.js project created in Firebase Studio.

## Granting Admin Access

The application has role-based security managed in Firestore. To access the admin dashboard, a user must have an `admin` role. By default, new users have a `user` role.

To grant a user admin privileges:

1.  The user must have already signed up for an account in the application.
2.  Go to your Firebase Console and open your Firestore Database.
3.  Find the `users` collection.
4.  Locate the document that corresponds to the user you want to make an admin (the document ID will be the user's UID).
5.  Edit the `role` field in that document and change its value from `user` to `admin`.

The user will have admin access the next time they log in.
