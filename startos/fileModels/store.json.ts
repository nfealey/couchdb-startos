import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z
  .object({
    adminPassword: z.string(),
    // Whether the one-time "service is running" notification has been sent.
    // (The credentials task is raised once at install by onInstall, which runs
    // before the first start, so no persisted flag is needed to gate it.)
    firstStartNotified: z.boolean().default(false),
  })
  .strip()

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
