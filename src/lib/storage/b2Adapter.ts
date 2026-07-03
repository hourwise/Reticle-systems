import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'
import type { StorageAdapter, StoredProject, StoredReport } from './types'

// ─── Helpers ─────────────────────────────────────────────────────

function getClient(): S3Client {
  const endpoint = import.meta.env.VITE_B2_ENDPOINT as string
  const region = import.meta.env.VITE_B2_REGION as string
  const keyId = import.meta.env.VITE_B2_APPLICATION_KEY_ID as string
  const key = import.meta.env.VITE_B2_APPLICATION_KEY as string

  if (!endpoint || !region || !keyId || !key) {
    throw new Error(
      'B2 config incomplete. Set VITE_B2_ENDPOINT, VITE_B2_REGION, VITE_B2_APPLICATION_KEY_ID, and VITE_B2_APPLICATION_KEY in .env',
    )
  }

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: keyId,
      secretAccessKey: key,
    },
  })
}

function bucketName(): string {
  return import.meta.env.VITE_B2_BUCKET_NAME as string
}

function encodeBody<T>(data: T): string {
  return JSON.stringify(data)
}

function decodeBody<T>(body: string): T {
  return JSON.parse(body) as T
}

// Key prefixes for organizing data in the bucket
const PREFIX_PROJECTS = 'projects/'
const PREFIX_REPORTS = 'reports/'
const PREFIX_UPLOADS = 'uploads/'

// ─── Adapter ─────────────────────────────────────────────────────

/**
 * Backblaze B2 adapter using the S3-compatible API.
 *
 * Stores structured data as JSON objects in a B2 bucket:
 *   - projects/{userId}/{projectId}.json
 *   - reports/{projectId}/{reportId}.json
 *   - uploads/{userId}/{filename}
 *
 * NOTE: B2 keys are visible in the browser (VITE_ prefix).
 * Create a restricted Application Key in B2 Console scoped to a single
 * bucket. For production, proxy through a backend.
 */
export const b2Adapter: StorageAdapter = {
  provider: 'Backblaze B2',

  isReady: () => {
    return Boolean(
      import.meta.env.VITE_B2_ENDPOINT &&
        import.meta.env.VITE_B2_REGION &&
        import.meta.env.VITE_B2_APPLICATION_KEY_ID &&
        import.meta.env.VITE_B2_APPLICATION_KEY &&
        import.meta.env.VITE_B2_BUCKET_NAME,
    )
  },

  // ── Projects ──────────────────────────────────────────────────

  async saveProject(project: StoredProject): Promise<void> {
    const client = getClient()
    const now = new Date().toISOString()

    const stored: StoredProject = {
      ...project,
      id: project.id || uuid(),
      createdAt: project.createdAt || now,
      updatedAt: now,
    }

    const key = `${PREFIX_PROJECTS}${stored.userId}/${stored.id}.json`

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName(),
        Key: key,
        Body: encodeBody(stored),
        ContentType: 'application/json',
      }),
    )

    // Mutate the original so the caller sees generated id/timestamps
    project.id = stored.id
    project.createdAt = stored.createdAt
    project.updatedAt = stored.updatedAt
  },

  async getProject(projectId: string): Promise<StoredProject | null> {
    const client = getClient()

    // List all project objects and search. This is O(n) — acceptable
    // for MVP. A production system would maintain a local index.
    const listed = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName(),
        Prefix: PREFIX_PROJECTS,
      }),
    )

    const contents = listed.Contents ?? []
    for (const obj of contents) {
      if (!obj.Key) continue
      try {
        const result = await client.send(
          new GetObjectCommand({ Bucket: bucketName(), Key: obj.Key }),
        )
        const body = await result.Body?.transformToString()
        if (!body) continue
        const project = decodeBody<StoredProject>(body)
        if (project.id === projectId) return project
      } catch {
        continue
      }
    }

    return null
  },

  async listProjects(userId: string): Promise<StoredProject[]> {
    const client = getClient()
    const prefix = `${PREFIX_PROJECTS}${userId}/`

    const listed = await client.send(
      new ListObjectsV2Command({ Bucket: bucketName(), Prefix: prefix }),
    )

    const projects: StoredProject[] = []
    const contents = listed.Contents ?? []

    for (const obj of contents) {
      if (!obj.Key) continue
      try {
        const result = await client.send(
          new GetObjectCommand({ Bucket: bucketName(), Key: obj.Key }),
        )
        const body = await result.Body?.transformToString()
        if (!body) continue
        projects.push(decodeBody<StoredProject>(body))
      } catch {
        continue
      }
    }

    return projects.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  async deleteProject(projectId: string): Promise<void> {
    const client = getClient()

    // Find and delete the project
    const listed = await client.send(
      new ListObjectsV2Command({ Bucket: bucketName(), Prefix: PREFIX_PROJECTS }),
    )

    const contents = listed.Contents ?? []
    for (const obj of contents) {
      if (!obj.Key) continue
      try {
        const result = await client.send(
          new GetObjectCommand({ Bucket: bucketName(), Key: obj.Key }),
        )
        const body = await result.Body?.transformToString()
        if (!body) continue
        const project = decodeBody<StoredProject>(body)
        if (project.id === projectId) {
          await client.send(
            new DeleteObjectCommand({ Bucket: bucketName(), Key: obj.Key }),
          )
          break
        }
      } catch {
        continue
      }
    }

    // Cascade delete reports
    const reportsListed = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName(),
        Prefix: `${PREFIX_REPORTS}${projectId}/`,
      }),
    )

    for (const obj of reportsListed.Contents ?? []) {
      if (!obj.Key) continue
      await client.send(
        new DeleteObjectCommand({ Bucket: bucketName(), Key: obj.Key }),
      )
    }
  },

  // ── Reports ───────────────────────────────────────────────────

  async saveReport(report: StoredReport): Promise<void> {
    const client = getClient()

    const stored: StoredReport = {
      ...report,
      id: report.id || uuid(),
      createdAt: report.createdAt || new Date().toISOString(),
    }

    const key = `${PREFIX_REPORTS}${stored.projectId}/${stored.id}.json`

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName(),
        Key: key,
        Body: encodeBody(stored),
        ContentType: 'application/json',
      }),
    )

    report.id = stored.id
    report.createdAt = stored.createdAt
  },

  async getReport(reportId: string): Promise<StoredReport | null> {
    const client = getClient()

    const listed = await client.send(
      new ListObjectsV2Command({ Bucket: bucketName(), Prefix: PREFIX_REPORTS }),
    )

    for (const obj of listed.Contents ?? []) {
      if (!obj.Key) continue
      try {
        const result = await client.send(
          new GetObjectCommand({ Bucket: bucketName(), Key: obj.Key }),
        )
        const body = await result.Body?.transformToString()
        if (!body) continue
        const report = decodeBody<StoredReport>(body)
        if (report.id === reportId) return report
      } catch {
        continue
      }
    }

    return null
  },

  async listReports(projectId: string): Promise<StoredReport[]> {
    const client = getClient()
    const prefix = `${PREFIX_REPORTS}${projectId}/`

    const listed = await client.send(
      new ListObjectsV2Command({ Bucket: bucketName(), Prefix: prefix }),
    )

    const reports: StoredReport[] = []

    for (const obj of listed.Contents ?? []) {
      if (!obj.Key) continue
      try {
        const result = await client.send(
          new GetObjectCommand({ Bucket: bucketName(), Key: obj.Key }),
        )
        const body = await result.Body?.transformToString()
        if (!body) continue
        reports.push(decodeBody<StoredReport>(body))
      } catch {
        continue
      }
    }

    return reports.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },

  // ── File uploads ──────────────────────────────────────────────

  async uploadFile(path: string, file: File): Promise<string> {
    const client = getClient()
    const key = `${PREFIX_UPLOADS}${path}`

    const buffer = await file.arrayBuffer()

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName(),
        Key: key,
        Body: new Uint8Array(buffer),
        ContentType: file.type || 'application/octet-stream',
      }),
    )

    return key
  },

  async getFileUrl(path: string): Promise<string> {
    const endpoint = import.meta.env.VITE_B2_ENDPOINT as string
    const bucket = bucketName()
    return `${endpoint}/${bucket}/${path}`
  },
}

