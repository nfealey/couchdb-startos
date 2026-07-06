import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.4.0:10',
  releaseNotes: {
    en_US:
      'Internal cleanup: credential surfacing is now owned solely by the install step (removed a redundant code path and its coordinating store flag). No user-facing change. Includes: live Reset Password with no downtime, notifications for password changes and first start, and the "Compact Databases" action.',
  },
  migrations: {
    // Password generation and config writing are handled by main() on first
    // run (single source of truth), so no install-time migration is required.
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
