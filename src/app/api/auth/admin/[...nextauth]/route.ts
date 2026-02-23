export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import NextAuth from "next-auth";
import { adminAuthOptions } from "@/lib/auth";

const handler = NextAuth(adminAuthOptions);
export { handler as GET, handler as POST };
