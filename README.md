# CouchDB for StartOS

Self-hosted sync backend for [Obsidian LiveSync](https://github.com/vrtmrz/obsidian-livesync).

Sync your Obsidian notes across all devices without paying for Obsidian Sync.

## Building

### Prerequisites

1. Install the StartOS SDK: https://docs.start9.com/packaging/0.4.0.x/quick-start.html
2. Node.js and npm

### Build

```bash
npm ci
make
```

This produces the architecture-specific packages `couchdb_x86_64.s9pk` and `couchdb_aarch64.s9pk`.

### Install on StartOS

```bash
make install
```

## Usage with Obsidian LiveSync

1. Install this CouchDB service on your StartOS server
2. Note the connection URL from the StartOS interface
3. In Obsidian, install the "Self-hosted LiveSync" community plugin
4. Configure the plugin:
   - **URI**: Your CouchDB URL from StartOS
   - **Username**: `admin`
   - **Password**: Retrieve it from the **Show Credentials** action in StartOS
   - **Database name**: `obsidian` (or any name you choose)
5. Enable sync

## Security Notes

- A unique admin password is generated automatically on first run — retrieve it via the **Show Credentials** action (there is no shared default password)
- Rotate the password at any time with the **Reset Password** action (stop the service first)
- Access CouchDB's Fauxton web UI to manage databases and users
- Consider enabling end-to-end encryption in the LiveSync plugin settings

## License

Apache-2.0 (same as CouchDB)
