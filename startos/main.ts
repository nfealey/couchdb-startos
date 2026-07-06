import { i18n } from './i18n'
import { sdk } from './sdk'
import { couchdbPort, mounts, getPassword } from './utils'
import { storeJson } from './fileModels/store.json'
import { localIni, generateLocalIni } from './fileModels/local.ini'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting CouchDB...'))

  // Read the store. On a normal install onInstall has already generated the
  // password (and surfaced the credentials task); this handles the pathological
  // case where the store is somehow absent so the daemon can still start.
  let store = await storeJson.read().once()

  if (!store) {
    console.info('No store found, generating admin password...')
    store = {
      adminPassword: getPassword(),
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

  // Surfacing the credentials task is owned entirely by onInstall (raised once
  // at install time). Here we only post a one-time notification the first time
  // the service actually starts, giving the user a persistent panel entry
  // pointing at their credentials.
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
