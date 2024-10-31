import AuthOptionProviders from "@/lib/AuthOptionProviders";
import NextAuth from "next-auth";

const handler = NextAuth(AuthOptionProviders);

export { handler as GET, handler as POST };
