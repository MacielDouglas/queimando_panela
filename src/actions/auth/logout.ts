'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function logoutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
}
