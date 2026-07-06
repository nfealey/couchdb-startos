import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.4.0:8',
  releaseNotes: {
    en_US:
      'Add a "Compact Databases" action that reclaims disk space by compacting every database and its view indexes — useful after heavy Obsidian LiveSync use or a LiveSync cleanup, which CouchDB only reclaims on compaction. Previous: surface credentials via a critical install-time task, install fix (write-after-const), password-reset correctness, local.ini-managed credentials, and HTTP readiness check.',
  },
  migrations: {
    // Password generation and config writing are handled by main() on first
    // run (single source of truth), so no install-time migration is required.
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
