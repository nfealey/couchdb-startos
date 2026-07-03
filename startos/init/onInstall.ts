import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'
import { getPassword } from '../utils'
import { showCredentials } from '../actions/showCredentials'

// Runs at install time, after actions are registered. Generates the admin
// password up front so the credentials exist immediately, and raises an
// "important" task surfacing the Show Credentials action — so the user can view
// their login as soon as the service is installed, without starting it first.
export const onInstall = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  const store = await storeJson.read().once()
  if (!store) {
    await storeJson.write(effects, {
      adminPassword: getPassword(),
      credentialsShown: true,
    })
  }

  await sdk.action.createOwnTask(effects, showCredentials, 'critical', {
    reason: i18n('View your CouchDB credentials for Obsidian LiveSync'),
  })
})
