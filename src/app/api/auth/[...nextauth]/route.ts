
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// In a real production app, you would verify credentials against Firebase Auth here 
// using the Firebase Admin SDK. For this prototype phase, we're bridging the 
// login to NextAuth so middleware and session management work correctly.

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const { email, password } = credentials;

        // Simple validation for prototype. 
        // In Phase 3, we can connect this to a more robust verifyPassword call.
        const isAdmin = email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        
        // Return a user object that includes the role
        return {
          id: isAdmin ? 'admin-uid' : 'user-uid',
          name: isAdmin ? 'Platform Admin' : 'Traveler',
          email: email,
          role: isAdmin ? 'admin' : 'user',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
