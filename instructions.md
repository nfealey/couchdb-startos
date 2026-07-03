# CouchDB Setup Instructions

## Initial Setup

1. Start the CouchDB service
2. Run the **Show Credentials** action to view your auto-generated admin username and password. A unique password is created automatically on first run — there is no shared default.
3. (Optional) Run the **Reset Password** action at any time to rotate the password. Stop the service first; you'll then need to update your Obsidian LiveSync settings with the new password.

## Connecting Obsidian LiveSync

1. In Obsidian, go to Settings → Community plugins
2. Search for and install "Self-hosted LiveSync"
3. Enable the plugin
4. Open plugin settings and configure:

   - **Remote Database URI**: Copy from StartOS interface
   - **Username**: `admin`
   - **Password**: Your CouchDB password
   - **Database name**: `obsidian` (will be created automatically)

5. Click "Test Connection" to verify
6. Enable "Live Sync" to start syncing

## Creating Additional Databases

If you want separate vaults in different databases:

1. Open Fauxton UI
2. Click "Create Database"
3. Use the new database name in LiveSync settings

## Troubleshooting

- **Connection refused**: Ensure CouchDB is running
- **Authentication failed**: Verify username/password
- **CORS errors**: CouchDB should be configured correctly by default
