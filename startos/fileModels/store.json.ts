import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z
  .object({
    adminPassword: z.string(),
    // Whether the "Show Credentials" task has already been surfaced to the
    // user. Tracked here (rather than inferring from store existence) so the
    // task fires exactly once regardless of who created the store.
    credentialsShown: z.boolean().default(false),
  })
  .strip()

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
