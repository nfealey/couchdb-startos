import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { localIni, generateLocalIni } from '../fileModels/local.ini'
import { getPassword, couchdbPort } from '../utils'

export const resetPassword = sdk.Action.withoutInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => ({
    name: i18n('Reset Password'),
    description: i18n('Generate a new admin password'),
    warning: i18n(
      'This will change your CouchDB password. You will need to update your Obsidian LiveSync settings with the new password.',
    ),
    // Runs whether the service is stopped or running: when running we apply the
    // change live (no downtime); when stopped it takes effect on next start.
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // execution function
  async ({ effects }) => {
    const newPassword = getPassword()

    // Read the current password *before* overwriting it — we need it to
    // authenticate the live config change against the running node.
    const store = await storeJson.read().once()
    const oldPassword = store?.adminPassword

    await storeJson.write(effects, {
      adminPassword: newPassword,
      firstStartNotified: store?.firstStartNotified ?? true,
    })

    // If the service is running, rotate the admin live via CouchDB's config
    // API so there's no downtime. `_node/_local` targets the running node
    // regardless of its name. Authenticate with the *old* password. If CouchDB
    // is unreachable (service stopped), this throws and we fall through — the
    // local.ini write below makes the new password take effect on next start.
    let appliedLive = false
    if (oldPassword) {
      try {
        const res = await fetch(
          `http://localhost:${couchdbPort}/_node/_local/_config/admins/admin`,
          {
            method: 'PUT',
            headers: {
              Authorization:
                'Basic ' +
                Buffer.from(`admin:${oldPassword}`).toString('base64'),
              'Content-Type': 'application/json',
            },
            // CouchDB expects the plaintext password as a JSON string; it
            // hashes it in place. The response echoes the previous value.
            body: JSON.stringify(newPassword),
          },
        )
        appliedLive = res.ok
      } catch {
        appliedLive = false
      }
    }

    // Write our canonical config last. A live PUT above rewrites this same file
    // (local.d/local.ini) with a hashed value; overwriting it here keeps the
    // clean, fully-templated plaintext version on disk. Because local.ini loads
    // after the entrypoint's docker.ini, this value wins on next start, where
    // CouchDB re-hashes the plaintext.
    await localIni.write(effects, generateLocalIni(newPassword))

    // Record this security-relevant event in the notifications panel.
    await sdk.notification.create(effects, {
      level: 'warning',
      title: i18n('CouchDB password changed'),
      message: appliedLive
        ? i18n(
            'The admin password was reset and applied immediately. Update your Obsidian LiveSync settings with the new password.',
          )
        : i18n(
            'The admin password was reset and takes effect the next time the service starts. Update your Obsidian LiveSync settings with the new password.',
          ),
    })

    return {
      version: '1',
      title: i18n('Password Reset'),
      message: appliedLive
        ? i18n(
            'Your password has been reset and is active now. Update your Obsidian LiveSync settings with the new password.',
          )
        : i18n(
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
