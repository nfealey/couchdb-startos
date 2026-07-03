import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.4.0:5',
  releaseNotes: {
    en_US:
      'Reliability fixes: password reset now applies correctly, credentials are managed via local.ini, readiness is checked over HTTP, and the "Show Credentials" task fires reliably on first run.',
  },
  migrations: {
    // Password generation and config writing are handled by main() on first
    // run (single source of truth), so no install-time migration is required.
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
