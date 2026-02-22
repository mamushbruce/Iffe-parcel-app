# iffe-travels

This is a professional adventure tourism platform built with Next.js, Firebase, and Tailwind CSS.

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
