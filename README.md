# iffe-travels

This is a professional adventure tourism platform built with Next.js, Firebase, and Tailwind CSS.

## Project Architecture & Development Phases

The creation of the Iffe-Travels platform was executed in five strategic phases to ensure a robust and scalable architecture:

1.  **Architecture & Environment Setup**: Establishing the Next.js App Router foundation, configuring Firebase SDKs, and setting up the ShadCN UI component library.
2.  **Authentication Infrastructure**: Building the NextAuth.js configuration to handle secure sessions, integrating it with Firebase Auth for traveler accounts and environment-based logic for the Admin account.
3.  **Admin Dashboard (The "Engine")**: Developing the management suite under `/admin`. This involved creating Firestore CRUD services for live pricing, safari packages, tour itineraries, and promotional codes.
4.  **Traveler Experience (The "Storefront")**: Designing the public-facing journeys, including the cinematic hero sections, the interactive Custom Safari Builder, and the real-time community chat.
5.  **Security & RBAC**: Implementing server-side middleware to protect administrative routes and ensuring the UI dynamically adapts to the user's role (Admin vs. Traveler).

## Authentication & Account Handling

The platform uses a hybrid authentication model designed for both security and development flexibility:

- **Unified Login**: A central `LoginModal` handles all authentication.
- **NextAuth + Firebase**: NextAuth manages the session lifecycle and JWT tokens, while Firebase Auth serves as the primary user database.
- **Admin Access**: During the prototype phase, the administrator role is assigned based on the `NEXT_PUBLIC_ADMIN_EMAIL`. This allows for immediate access to business controls without manual user creation.
- **Route Protection**: `middleware.ts` acts as a security gatekeeper, checking the `role` property within the session JWT to restrict `/admin` routes to authorized personnel only.

## Deployment to Vercel

To deploy this application to Vercel, follow these steps:

1.  **Push to GitHub**: Push your latest code changes to a GitHub repository.
2.  **Import to Vercel**: Connect your GitHub account to Vercel and import the project.
3.  **Environment Variables**: Add the following variables in Vercel Project Settings:
    *   `NEXT_PUBLIC_FIREBASE_API_KEY`
    *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    *   `NEXT_PUBLIC_FIREBASE_APP_ID`
    *   `NEXT_PUBLIC_ADMIN_EMAIL` (e.g., admin@iffe-travels.com)
    *   `NEXTAUTH_SECRET` (A random secure string)
    *   `NEXTAUTH_URL` (Your production URL, e.g., https://your-app.vercel.app)
4.  **Firebase Configuration**:
    *   Go to Firebase Console > Build > Authentication > Settings > Authorized Domains.
    *   Add your Vercel deployment URL (e.g., `your-app.vercel.app`) to the list.

## Local Development

```bash
npm install
npm run dev
```

Your app will be running at [http://localhost:9002](http://localhost:9002).
