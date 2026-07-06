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

### Releases (install by URL)

Pushing a version tag (e.g. `v3.4.0-10`) triggers the [release workflow](.github/workflows/release.yml), which builds both architectures and attaches `couchdb_x86_64.s9pk` and `couchdb_aarch64.s9pk` to a GitHub Release. To install without building locally, download the `.s9pk` for your server's architecture from the [Releases page](https://github.com/nfealey/couchdb-startos/releases) (or copy its URL) and use **System → Sideload** in StartOS.

> Optionally set a `STARTOS_DEVELOPER_KEY` repository secret (the contents of `~/.startos/developer.key.pem`) so every release is signed with the same publisher identity. Without it, each build self-signs with an ephemeral key — still valid and installable.

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
- Rotate the password at any time with the **Reset Password** action — it applies live while the service is running (no downtime) and also works when stopped
- Access CouchDB's Fauxton web UI to manage databases and users
- Consider enabling end-to-end encryption in the LiveSync plugin settings

## License

Apache-2.0 (same as CouchDB)
