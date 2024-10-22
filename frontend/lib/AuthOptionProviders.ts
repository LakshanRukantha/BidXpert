import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";

// Extend the default user type to include the role property
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }
}

const credentialsAuth = CredentialsProvider({
  name: "credentials",
  credentials: {}, // Keep it blank for handling default UI in next-auth

  // The authorize function is called when a user tries to sign in with email and password
  async authorize(credentials) {
    const { email, password } = credentials as {
      email: string;
      password: string;
    };

    // Check if email and password are present
    if (!email || !password) {
      return null;
    }

    // Try to authenticate the user and return the user object
    try {
      // Mock API call to check if the user exists and the password is correct
      const user = {
        id: "1",
        email: email,
        firstName: "Lakshan",
        lastName: "Rukantha",
        role: "admin",
      };

      // Example user object
      const authenticatedUser: User = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };

      // Return the user object
      return authenticatedUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
});

export const AuthOptionProviders: NextAuthOptions = {
  providers: [credentialsAuth],
  secret: process.env.AUTH_SECRET as string,

  callbacks: {
    // Include custom properties in the JWT token
    async jwt({ token, user }) {
      // Add user properties to token if user exists (this happens on login)
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
      }

      // Return the token with user properties
      return token;
    },

    // Populate the session with the token values
    async session({ session, token }) {
      // Assign values from token to session.user
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: `${token.firstName as string} ${token.lastName as string}`,
        role: token.role as string,
      };

      // Return the modified session object
      return session;
    },
  },
};

export default AuthOptionProviders;
