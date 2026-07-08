import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-server-session";

export async function requireSession(redirectTo: "/sign-in") {
  const session = await getServerSession();

  if (!session) {
    redirect(redirectTo);
  }
}
