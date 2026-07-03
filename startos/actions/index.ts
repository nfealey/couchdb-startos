import { sdk } from '../sdk'
import { showCredentials } from './showCredentials'
import { resetPassword } from './resetPassword'

export const actions = sdk.Actions.of()
  .addAction(showCredentials)
  .addAction(resetPassword)
