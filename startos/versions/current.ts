import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.4.0:6',
  releaseNotes: {
    en_US:
      'Fix install failure (write-after-const on store.json), surface credentials via an install-time task, and reliability fixes: password reset applies correctly, credentials managed via local.ini, HTTP readiness check.',
  },
  migrations: {
    // Password generation and config writing are handled by main() on first
    // run (single source of truth), so no install-time migration is required.
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
