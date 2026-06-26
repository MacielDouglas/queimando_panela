export type AuthProvider = "google";

export interface AuthState {
  isSubmitting: boolean;
  error: string | null;
}
