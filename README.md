# iffe-travels

This is a professional adventure tourism platform built with Next.js, Firebase, and Tailwind CSS.

## Admin Credentials
To access the Admin Dashboard (/admin), use the following credentials:
- **Email**: `admin@iffe-travels.com`
- **Password**: [The password you created in the Firebase Console for this email]

*If you haven't created this user yet, go to your Firebase Console > Authentication > Users > Add User.*

## Project Architecture & Development Phases

The creation of the Iffe-Travels platform was executed in five strategic phases to ensure a robust and scalable architecture:

1.  **Phase 1: Foundation & Infrastructure**: Establishing the Next.js App Router foundation, configuring Tailwind CSS for the design system, and initializing the Firebase SDK for real-time data and authentication.
2.  **Phase 2: Authentication & Security Framework**: Building a direct Firebase Authentication layer using a custom `AuthContext` for real-time session management. Implemented role-based redirects to separate the Admin Engine from the Traveler Experience.
3.  **Phase 3: Administrative Business Engine**: Developing the `/admin` suite to manage core business assets. This included creating Firestore-connected modules for live inventory, dynamic pricing, expedition itineraries, and promotional codes.
4.  **Phase 4: Traveler Experience & Storefront**: Designing the public-facing journey and the new `/dashboard` for logged-in travelers, featuring personalized announcements, secure document access, and support chat.
5.  **Phase 5: Data Synchronization & Live Integration**: Finalizing the bridge between management controls and public views, ensuring that pricing updates and new tour content are published globally in real-time.

## Authentication & Account Handling Process

The platform utilizes a direct Firebase Authentication flow designed for both traveler convenience and administrative security:

-   **Unified Auth Context**: We use a custom `AuthContext.tsx` to listen to `onAuthStateChanged`, providing global access to the current user's state.
-   **Role-Based Redirection**: Upon login, the system evaluates the user's email. If it matches the `NEXT_PUBLIC_ADMIN_EMAIL`, the user is routed to `/admin`. Otherwise, they are sent to `/dashboard`.
-   **Open Security Rules (Prototype)**: During this phase, Firestore rules are set to `allow read, write: if true` to facilitate rapid development and testing of all features.

## Deployment to Vercel

To deploy this application to Vercel, follow these steps:

1.  **Push to GitHub**: Push your latest code changes to a GitHub repository.
2.  **Import to Vercel**: Connect your account and import the project.
3.  **Environment Variables**: Add all variables from your `.env` file to Vercel Project Settings.
4.  **Firebase Configuration**: Ensure your Vercel deployment URL is added to the "Authorized Domains" in the Firebase Console (Build > Authentication > Settings).

## Local Development

```bash
npm install
npm run dev
```

Your app will be running at [http://localhost:9002](http://localhost:9002).
