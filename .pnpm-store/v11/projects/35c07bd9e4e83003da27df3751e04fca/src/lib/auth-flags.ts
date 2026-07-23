/**
 * Feature flags for auth providers (PR1). Safe defaults for merge before Supabase is configured.
 * Documented in web/docs/FEB_2026_AUTH_SETUP.md.
 */
export const AUTH_ENABLE_GOOGLE =
  process.env.NEXT_PUBLIC_AUTH_ENABLE_GOOGLE === 'true';
export const AUTH_ENABLE_APPLE =
  process.env.NEXT_PUBLIC_AUTH_ENABLE_APPLE === 'true';
export const AUTH_ENABLE_EMAIL_OTP =
  process.env.NEXT_PUBLIC_AUTH_ENABLE_EMAIL_OTP !== 'false';
