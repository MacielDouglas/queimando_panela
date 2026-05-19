import { headers } from 'next/headers';
import { auth } from './auth';

export async function getServerSession() {
  const hdrs = await headers();

  const session = await auth.api.getSession({
    headers: hdrs,
  });

  return session;
}
