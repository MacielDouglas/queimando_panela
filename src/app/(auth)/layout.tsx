import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AuthLayout({ children }: AppLayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) redirect("/");

  return <div>{children}</div>;
}
