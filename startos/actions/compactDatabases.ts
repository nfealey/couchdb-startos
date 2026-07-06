import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { couchdbPort } from '../utils'

// Trigger CouchDB compaction on every database (and its view indexes).
//
// CouchDB is append-only (MVCC): updating or deleting a document leaves the old
// revision body on disk until compaction rewrites the file. Obsidian LiveSync
// writes a new revision on every change and stores notes as content-addressed
// chunks, so the .couch files bloat quickly — especially after a LiveSync
// cleanup/rebuild, which only *marks* orphaned chunks as deleted. Compaction is
// what actually reclaims that disk space. It runs in the background (CouchDB
// returns 202 immediately), so this action starts it and reports, rather than
// waiting for completion.
export const compactDatabases = sdk.Action.withoutInput(
  // id
  'compact-databases',

  // metadata
  async ({ effects }) => ({
    name: i18n('Compact Databases'),
    description: i18n(
      'Reclaim disk space by compacting every database and its indexes. CouchDB keeps old document revisions on disk until compaction runs, so this can free significant space after heavy syncing or a LiveSync cleanup.',
    ),
    warning: i18n(
      'Compaction runs in the background and the service keeps serving requests. Large databases may take several minutes to finish.',
    ),
    // Compaction is an online operation and requires the daemon to be up.
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  // execution function
  async ({ effects }) => {
    const store = await storeJson.read().once()
    if (!store) {
      throw new Error('Store not found - please start the service first')
    }

    const base = `http://localhost:${couchdbPort}`
    const headers = {
      Authorization:
        'Basic ' +
        Buffer.from(`admin:${store.adminPassword}`).toString('base64'),
      'Content-Type': 'application/json',
    }

    // Enumerate every database, including CouchDB's system dbs (_users,
    // _replicator, _global_changes) — those accumulate revisions too.
    const dbsRes = await fetch(`${base}/_all_dbs`, { headers })
    if (!dbsRes.ok) {
      throw new Error(
        `Failed to list databases (HTTP ${dbsRes.status}). Check that the service is running.`,
      )
    }
    const dbs = (await dbsRes.json()) as string[]

    const compacted: string[] = []
    const failed: string[] = []

    for (const db of dbs) {
      const encoded = encodeURIComponent(db)

      // Compact the database itself.
      const res = await fetch(`${base}/${encoded}/_compact`, {
        method: 'POST',
        headers,
      })
      if (!res.ok) {
        failed.push(db)
        continue
      }
      compacted.push(db)

      // Compact each design document's view indexes, which grow independently
      // of the database file.
      const ddocsRes = await fetch(`${base}/${encoded}/_design_docs`, {
        headers,
      })
      if (ddocsRes.ok) {
        const body = (await ddocsRes.json()) as {
          rows?: { id: string }[]
        }
        for (const row of body.rows ?? []) {
          const ddoc = row.id.replace(/^_design\//, '')
          await fetch(`${base}/${encoded}/_compact/${encodeURIComponent(ddoc)}`, {
            method: 'POST',
            headers,
          })
        }
      }
    }

    const value: {
      type: 'single'
      name: string
      description: null
      value: string
      masked: boolean
      copyable: boolean
      qr: boolean
    }[] = [
      {
        type: 'single',
        name: i18n('Databases'),
        description: null,
        value: compacted.join(', ') || '—',
        masked: false,
        copyable: false,
        qr: false,
      },
    ]

    if (failed.length) {
      value.push({
        type: 'single',
        name: i18n('Failed to start'),
        description: null,
        value: failed.join(', '),
        masked: false,
        copyable: false,
        qr: false,
      })
    }

    return {
      version: '1',
      title: i18n('Compaction Started'),
      message: i18n(
        'Compaction started for ${count} database(s). Large databases may take a few minutes to finish in the background.',
        { count: compacted.length },
      ),
      result: {
        type: 'group',
        value,
      },
    }
  },
)
