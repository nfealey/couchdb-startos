import { sdk } from '../sdk'
import { showCredentials } from './showCredentials'
import { resetPassword } from './resetPassword'
import { compactDatabases } from './compactDatabases'

export const actions = sdk.Actions.of()
  .addAction(showCredentials)
  .addAction(resetPassword)
  .addAction(compactDatabases)
