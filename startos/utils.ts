import { utils } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export const couchdbPort = 5984

export function getPassword() {
  return utils.getDefaultString({
    charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
    len: 22,
  })
}

export const mounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/opt/couchdb/data',
    readonly: false,
  })
  .mountVolume({
    volumeId: 'config',
    subpath: null,
    mountpoint: '/opt/couchdb/etc/local.d',
    readonly: false,
  })
