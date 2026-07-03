import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { localIni, generateLocalIni } from '../fileModels/local.ini'
import { getPassword } from '../utils'

export const resetPassword = sdk.Action.withoutInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => ({
    name: i18n('Reset Password'),
    description: i18n('Generate a new admin password'),
    warning: i18n(
      'This will change your CouchDB password. You will need to update your Obsidian LiveSync settings.',
    ),
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'enabled',
  }),

  // execution function
  async ({ effects }) => {
    const newPassword = getPassword()

    // Update store, preserving other fields (e.g. credentialsShown)
    const store = await storeJson.read().once()
    await storeJson.write(effects, {
      ...store,
      adminPassword: newPassword,
      credentialsShown: store?.credentialsShown ?? true,
    })

    // Rewrite CouchDB config with the new admin password. Because local.ini is
    // loaded after the entrypoint's docker.ini, this value wins on next start.
    await localIni.write(effects, generateLocalIni(newPassword))

    return {
      version: '1',
      title: i18n('Password Reset'),
      message: i18n(
        'Your password has been reset. Update your Obsidian LiveSync settings with the new password.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: 'admin',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('New Password'),
            description: null,
            value: newPassword,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
