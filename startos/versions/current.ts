import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.4.0:7',
  releaseNotes: {
    en_US:
      'Surface credentials via a critical install-time task (per the StartOS "prompt for admin credentials" recipe). Includes the earlier install fix (write-after-const), password-reset correctness, local.ini-managed credentials, and HTTP readiness check.',
  },
  migrations: {
    // Password generation and config writing are handled by main() on first
    // run (single source of truth), so no install-time migration is required.
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
