import { i18n } from './i18n'
import { sdk } from './sdk'
import { couchdbPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const apiMulti = sdk.MultiHost.of(effects, 'api-multi')
  const apiMultiOrigin = await apiMulti.bindPort(couchdbPort, {
    protocol: 'http',
  })

  const api = sdk.createInterface(effects, {
    name: i18n('CouchDB API'),
    id: 'api',
    description: i18n('The CouchDB HTTP API for Obsidian LiveSync'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Fauxton UI'),
    id: 'ui',
    description: i18n('CouchDB web administration interface'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '/_utils',
    query: {},
  })

  const apiReceipt = await apiMultiOrigin.export([api, ui])

  return [apiReceipt]
})
