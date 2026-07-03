import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'couchdb',
  title: 'CouchDB',
  license: 'Apache-2.0',
  packageRepo: 'https://github.com/nfealey/couchdb-startos',
  upstreamRepo: 'https://github.com/apache/couchdb',
  marketingUrl: 'https://couchdb.apache.org/',
  donationUrl: 'https://www.apache.org/foundation/contributing.html',
  description: { short, long },
  volumes: ['main', 'config'],
  images: {
    main: {
      source: { dockerTag: 'couchdb:3.4.3' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    // No install alert: credentials are surfaced right after install by an
    // "important" task (see startos/init/onInstall.ts), not a pre-install popup.
    install: null,
    update: null,
    uninstall: null,
    restore:
      'Restoring reverts CouchDB to the data and admin credentials captured in this backup. If you changed your password after this backup was taken, the older password will apply again — run the "Show Credentials" action after restoring to confirm your current login.',
    start: null,
    stop: null,
  },
  dependencies: {},
})
