import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";
import axios from "axios";
import bcrypt from "bcryptjs";

// Disable SSL verification in development only
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined");
}

// Extend the default user type to include the role property
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User {
    id: number;
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
      const response = await axios.post(`${BACKEND_URL}/api/user/signin`, {
        firstname: "", // TODO: FIX THIS IN THE BACKEND (NOT NEEDED firstname)
        lastname: "", // TODO: FIX THIS IN THE BACKEND (NOT NEEDED lastname)
        email,
        password: "",
      });

      const user = await response.data;

      console.table(user);

      // Check if the user exists
      if (response.status !== 200) {
        return null;
      }

      if (typeof user.password !== "string") {
        return null;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return null;
      }

      // Create a user object
      const authenticatedUser: User = {
        id: user.userId,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        role: user.isAdmin ? "admin" : "user",
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
        id: token.id as number,
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
