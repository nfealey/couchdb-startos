export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting CouchDB...': 0,
  'CouchDB Ready': 1,
  'CouchDB is accepting connections': 2,
  'CouchDB is not responding': 3,

  // interfaces.ts
  'CouchDB API': 4,
  'The CouchDB HTTP API for Obsidian LiveSync': 5,
  'Fauxton UI': 6,
  'CouchDB web administration interface': 7,

  // actions
  'Show Credentials': 8,
  'Display the CouchDB admin credentials for Obsidian LiveSync': 9,
  'CouchDB Credentials': 10,
  'Use these credentials to configure Obsidian LiveSync': 11,
  'Username': 12,
  'Password': 13,
  'Reset Password': 14,
  'Generate a new admin password': 15,
  'This will change your CouchDB password. You will need to update your Obsidian LiveSync settings with the new password.': 16,
  'Password Reset': 17,
  'Your password has been reset. Update your Obsidian LiveSync settings with the new password.': 18,
  'New Password': 19,
  'View your CouchDB credentials for Obsidian LiveSync': 20,
  'Compact Databases': 21,
  'Reclaim disk space by compacting every database and its indexes. CouchDB keeps old document revisions on disk until compaction runs, so this can free significant space after heavy syncing or a LiveSync cleanup.': 22,
  'Compaction runs in the background and the service keeps serving requests. Large databases may take several minutes to finish.': 23,
  'Compaction Started': 24,
  'Compaction started for ${count} database(s). Large databases may take a few minutes to finish in the background.': 25,
  'Databases': 26,
  'Failed to start': 27,
  'CouchDB password changed': 28,
  'The admin password was reset and applied immediately. Update your Obsidian LiveSync settings with the new password.': 29,
  'The admin password was reset and takes effect the next time the service starts. Update your Obsidian LiveSync settings with the new password.': 30,
  'Your password has been reset and is active now. Update your Obsidian LiveSync settings with the new password.': 31,
  'CouchDB is running': 32,
  'CouchDB is ready for Obsidian LiveSync. Retrieve your admin login with the Show Credentials action.': 33,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
