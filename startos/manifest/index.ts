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
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
