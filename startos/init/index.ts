import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { onInstall } from './onInstall'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  // Must come after `actions` so the Show Credentials action is registered
  // before onInstall raises a task pointing at it.
  onInstall,
)

export const uninit = sdk.setupUninit(versionGraph)
