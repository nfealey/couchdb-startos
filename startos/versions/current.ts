import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.4.0:9',
  releaseNotes: {
    en_US:
      'Reset Password now works while the service is running — it rotates the admin live via CouchDB\'s config API with no downtime (still works when stopped too). Added notifications for password changes and first start. Previous: "Compact Databases" action to reclaim disk space, credentials via a critical install-time task, and HTTP readiness check.',
  },
  migrations: {
    // Password generation and config writing are handled by main() on first
    // run (single source of truth), so no install-time migration is required.
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
