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

## Maintenance: Reclaiming Disk Space

CouchDB keeps old revisions of every document on disk until it compacts. Because Obsidian LiveSync writes a new revision on every change, your database grows over time — and a LiveSync "cleanup"/"rebuild" only *marks* old data for removal; CouchDB doesn't reclaim the space until it compacts.

Run the **Compact Databases** action periodically (the service can stay running) to compact every database and its view indexes and shrink the on-disk files. It's especially worth running right after a LiveSync cleanup or rebuild. Compaction happens in the background, so large databases may take a few minutes to finish after the action reports.

## Creating Additional Databases

If you want separate vaults in different databases:

1. Open Fauxton UI
2. Click "Create Database"
3. Use the new database name in LiveSync settings

## Troubleshooting

- **Connection refused**: Ensure CouchDB is running
- **Authentication failed**: Verify username/password
- **CORS errors**: CouchDB should be configured correctly by default
