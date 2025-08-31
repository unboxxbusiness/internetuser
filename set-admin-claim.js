
// This script is used to set a custom user claim on a Firebase user account.
// It grants the 'admin' role, allowing access to the admin dashboard.
//
// Usage: node set-admin-claim.js <email>
//
// Before running, make sure you have a .env.local file with your
// Firebase Admin SDK credentials, and have run `npm install`.

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// --- Check for email argument ---
const email = process.argv[2];
if (!email) {
  console.error('Error: Please provide the user\'s email as an argument.');
  console.log('Usage: node set-admin-claim.js <user@example.com>');
  process.exit(1);
}

// --- Initialize Firebase Admin SDK ---
// Your service account key is loaded from .env.local
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    console.error('Error: Firebase Admin credentials are not found in .env.local.');
    console.error('Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.');
    process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// --- Main logic to set custom claim ---
async function setAdminClaim(email) {
  try {
    console.log(`Fetching user with email: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);

    console.log(`Found user: ${user.uid}. Checking current claims...`);
    const currentClaims = user.customClaims || {};

    if (currentClaims.role === 'admin') {
        console.log(`✅ User ${email} already has the 'admin' role.`);
        return;
    }

    console.log("Setting 'admin' role...");
    await admin.auth().setCustomUserClaims(user.uid, { ...currentClaims, role: 'admin' });

    console.log(`✅ Success! User ${email} has been granted the 'admin' role.`);
    console.log("They will have admin access on their next login.");

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
        console.error(`Error: No user found with the email: ${email}`);
        console.error("Please make sure the user has already signed up in your application.");
    } else {
        console.error('An unexpected error occurred:');
        console.error(error);
    }
  }
}

setAdminClaim(email);
