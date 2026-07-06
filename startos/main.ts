import { i18n } from './i18n'
import { sdk } from './sdk'
import { couchdbPort, mounts, getPassword } from './utils'
import { storeJson } from './fileModels/store.json'
import { localIni, generateLocalIni } from './fileModels/local.ini'
import { showCredentials } from './actions/showCredentials'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting CouchDB...'))

  // Read password from store, or generate one if this is the first run.
  // main() is the single source of truth for credential generation.
  let store = await storeJson.read().once()

  if (!store) {
    console.info('First run detected, generating admin password...')
    store = {
      adminPassword: getPassword(),
      credentialsShown: false,
      firstStartNotified: false,
    }
    await storeJson.write(effects, store)
  }

  const password = store.adminPassword

  // Write the config (admin credentials + CORS) before the daemon starts.
  await localIni.write(effects, generateLocalIni(password))

  const subcontainer = await sdk.SubContainer.of(
    effects,
    { imageId: 'main' },
    mounts,
    'couchdb-sub',
  )

  // Surface the credentials task exactly once, the first time the service runs.
  // Keyed on a persisted flag rather than store existence, so it fires reliably
  // even though the store may have been created before this point.
  if (!store.credentialsShown) {
    await sdk.action.createOwnTask(effects, showCredentials, 'critical', {
      reason: i18n('View your CouchDB credentials for Obsidian LiveSync'),
    })
    store = { ...store, credentialsShown: true }
    await storeJson.write(effects, store)
  }

  // Post a one-time notification the first time the service actually starts,
  // giving the user a persistent panel entry pointing at their credentials.
  if (!store.firstStartNotified) {
    await sdk.notification.create(effects, {
      level: 'info',
      title: i18n('CouchDB is running'),
      message: i18n(
        'CouchDB is ready for Obsidian LiveSync. Retrieve your admin login with the Show Credentials action.',
      ),
    })
    store = { ...store, firstStartNotified: true }
    await storeJson.write(effects, store)
  }

  return sdk.Daemons.of(effects).addDaemon('couchdb', {
    subcontainer,
    exec: {
      // Credentials live in local.ini ([admins]); no COUCHDB_USER/PASSWORD env.
      command: sdk.useEntrypoint(),
    },
    ready: {
      display: i18n('CouchDB Ready'),
      fn: () =>
        // Hit /_up (exempt from auth via require_valid_user_except_for_up) so
        // "ready" reflects CouchDB actually serving HTTP, not just an open port.
        sdk.healthCheck.checkWebUrl(
          effects,
          `http://localhost:${couchdbPort}/_up`,
          {
            successMessage: i18n('CouchDB is accepting connections'),
            errorMessage: i18n('CouchDB is not responding'),
          },
        ),
    },
    requires: [],
  })
})
