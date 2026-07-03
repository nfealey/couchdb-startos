import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

export const showCredentials = sdk.Action.withoutInput(
  // id
  'show-credentials',

  // metadata
  async ({ effects }) => ({
    name: i18n('Show Credentials'),
    description: i18n('Display the CouchDB admin credentials for Obsidian LiveSync'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // execution function
  async ({ effects }) => {
    const store = await storeJson.read().const(effects)

    if (!store) {
      throw new Error('Store not found - please restart the service')
    }

    return {
      version: '1',
      title: i18n('CouchDB Credentials'),
      message: i18n('Use these credentials to configure Obsidian LiveSync'),
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
            name: i18n('Password'),
            description: null,
            value: store.adminPassword,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
